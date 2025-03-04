import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@nnpp/database';
import aqp from 'api-query-params';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private databaseService: DatabaseService){}
  async findAll(currentPage: number, limit: number, qs: string) {
    let filter = {};
    let parsedQuery = {};
    let listTags = [];
  
    try {
      // Phân tích query string để lấy các tham số lọc
      if (qs) {
        parsedQuery = aqp(qs);
        filter = parsedQuery['filter'] || {};
      }
      console.log("Parsed Query:", parsedQuery); // Log parsed query
    } catch (error) {
      console.error('❌ Lỗi parse query string:', error);
      filter = {}; // Default filter nếu lỗi
    }
  
    // Trang hiện tại và kích thước trang
    const page = Number(parsedQuery['currentPage']) || Number(currentPage) || 1;
    const pageSize = Number(parsedQuery['pageSize']) || Number(limit) || 10;
    const offset = (page > 0 ? page - 1 : 0) * pageSize;
  
    // 🏷 Lấy danh sách tags từ query (nếu có)
    if (parsedQuery['filter'] && parsedQuery['filter']['tags']) {
      listTags = parsedQuery['filter']['tags'].split(',');
    }
  
    console.log("List Tags:", listTags); // Log danh sách tags đã lấy
  
    let tagFilter = {};
  
    // Nếu có tags, thêm điều kiện lọc
    if (listTags.length > 0) {
      tagFilter = {
        tags: {
          some: {
            tag: {
              title: {
                in: listTags, // Tìm kiếm các bài viết có tags trong danh sách listTags
              },
            },
          },
        },
      };
    }
  
    console.log("Tag Filter:", tagFilter); // Log filter được tạo ra
  
    try {
      // Lấy tổng số bài viết thỏa mãn điều kiện filter
      const totalItems = await this.databaseService.article.count({
        where: tagFilter,
      });
      console.log("Total Items:", totalItems); // Log tổng số bài viết
  
      // Lấy danh sách bài viết theo điều kiện đã lọc và phân trang
      const articles = await this.databaseService.article.findMany({
        where: tagFilter,
        skip: offset,
        take: pageSize,
        include: {
          author: {
            select: {
              username: true,
              bio: true,
              image: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  title: true,
                },
              },
            },
          },
          favorites: true,
        },
      });
  
      console.log("Articles:", articles); // Log danh sách bài viết
  
      return {
        meta: {
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalItems / pageSize),
          totalItems,
          searchedTags: listTags, // Trả về các tag đã tìm kiếm
        },
        articles,
      };
    } catch (error) {
      console.error('❌ Lỗi truy vấn Prisma:', error);
      throw new Error('Không thể lấy danh sách bài viết');
    }
  }
  async createArticle(userId: number, createArticleDto: CreateArticleDto) {
    const { title, description, body, tagList } = createArticleDto;

    // Kiểm tra nếu không có tagList thì báo lỗi
    if (!tagList || tagList.length === 0) {
      throw new Error('Bạn phải cung cấp ít nhất một tag để tạo bài viết!');
    }

    // Tạo slug từ title
    const slug = title.toLowerCase().replace(/ /g, '-');

    // Tạo bài viết
    const article = await this.databaseService.article.create({
      data: {
        title,
        description,
        body,
        slug,
        total_like: '0', // 🔥 Thêm trường `total_like`, có thể để giá trị mặc định là '0'
        author: {
          connect: { id: userId }, // Kết nối với user
        },
        tags: {
          create: tagList.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { title: tag },
                create: { title: tag, is_active: true },
              },
            },
          })),
        },
      },
      include: {
        author: { select: { username: true, bio: true, image: true } },
        tags: { select: { tag: { select: { title: true } } } },
      },
    });

    return article;
  }
  async findFeed(currentPage: number, limit: number, userId: number, qs: string) {
    let parsedQuery = {};
    let listTags = [];
    let tagFilter = {};

    try {
      // Parse the query string
      if (qs) {
        parsedQuery = aqp(qs);
        listTags = parsedQuery['filter']?.tags?.split(',') || [];
      }
    } catch (error) {
      console.error('❌ Error parsing query string:', error);
    }

    const page = Number(parsedQuery['currentPage']) || Number(currentPage) || 1;
    const pageSize = Number(parsedQuery['pageSize']) || Number(limit) || 10;
    const offset = (page - 1) * pageSize;

    // Fetch the list of followed users
    const followedUsers = await this.databaseService.follower.findMany({
      where:{
        following_id: userId
      },
      select:{
        following_id: true
      }
    });

    const followedUserIds = followedUsers.map(follow => follow.following_id);

    // Fetch articles from followed users
    let articlesQuery = {
      where: {
        authorId: { in: followedUserIds }, // Get articles from followed users
      },
      skip: offset,
      take: pageSize,
      orderBy: {
        createdAt: 'desc' as const,  // Order by most recent first
      },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                title: true,
              },
            },
          },
        },
        favorites: true,
      },
    };
    // Get total count of articles
    const totalItems = await this.databaseService.article.count({
      where: articlesQuery.where,
    });

    // Get the list of articles
    const articles = await this.databaseService.article.findMany(articlesQuery);

    return {
      meta: {
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems,
        searchedTags: listTags,  // Include the searched tags
      },
      articles,
    };
  }
  async findOneBySlug(slug: string) {
    try {
      return await this.databaseService.article.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              username: true,
              bio: true,
              image: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  title: true,
                },
              },
            },
          },
          favorites: true,
        },
      });
    } catch (error) {
      console.error('❌ Lỗi truy vấn Prisma:', error);
      throw new Error('Không thể lấy bài viết');
    }
  }
  async update(slug: string, updateArticleDto: UpdateArticleDto) {
    try {
      // Tìm bài viết theo slug
      const article = await this.databaseService.article.findUnique({
        where: { slug },
      });
  
      if (!article) {
        throw new Error('Article not found');
      }
  
      // Cập nhật bài viết với dữ liệu từ DTO
      const updatedArticle = await this.databaseService.article.update({
        where: { slug },
        data: {
          title: updateArticleDto.title, // Cập nhật chỉ trường title
          description:updateArticleDto.description,
          body: updateArticleDto.body,
        },
      });
  
      return updatedArticle;  // Trả về bài viết đã cập nhật
    } catch (error) {
      throw new Error(`Error updating article: ${error.message}`);
    }
  }
}
