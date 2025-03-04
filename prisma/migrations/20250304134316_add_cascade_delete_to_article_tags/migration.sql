-- DropForeignKey
ALTER TABLE "Article_Tag" DROP CONSTRAINT "Article_Tag_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Article_Tag" DROP CONSTRAINT "Article_Tag_tagId_fkey";

-- AddForeignKey
ALTER TABLE "Article_Tag" ADD CONSTRAINT "Article_Tag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article_Tag" ADD CONSTRAINT "Article_Tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
