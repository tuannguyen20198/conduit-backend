import api from "@/lib/axiosConfig";
import { useState } from "react";

// Define the Comment type
interface Comment {
    id: string;
    body: string;
    author: {
        username: string;
        image?: string;
    };
    createdAt: string;
}
import { useParams } from "react-router-dom";

const Comment = () => {
    const [commentText, setCommentText] = useState(''); // State for comment input
    const [comments, setComments] = useState<Comment[]>([]); // State to store comments
    const { slug } = useParams();
    const user = { username: 'defaultUser', image: 'http://i.imgur.com/Qr71crq.jpg' }; // Mock user object
    // Post a new comment
    const handlePostComment = async () => {
        if (!commentText.trim()) return; // Don't post empty comments

        try {
            const response = await api.post(`/articles/${slug}/comments`, {
                comment: { body: commentText },
            });
            setComments([response.data.comment, ...comments]); // Add the new comment to the list
            setCommentText(''); // Clear the comment input
        } catch (error) {
            alert('Error posting comment');
        }
    };

    // Delete a comment
    const handleDeleteComment = async (commentId: string) => {
        try {
            if (window.confirm('Are you sure you want to delete this comment?')) {
                await api.delete(`/articles/${slug}/comments/${commentId}`);
                setComments(comments.filter((comment) => comment.id !== commentId)); // Remove deleted comment from list
                alert('Comment deleted');
            }
        } catch (err) {
            console.log(err);
            alert('Error deleting comment');
        }
    };


    return (
        <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
                <form className="card comment-form" onSubmit={(e) => { e.preventDefault(); handlePostComment(); }}>
                    <div className="card-block">
                        <textarea
                            className="form-control"
                            placeholder="Write a comment..."
                            rows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                    </div>
                    <div className="card-footer">
                        <img src={user.image} className="comment-author-img" />
                        <button className="btn btn-sm btn-primary">Post Comment</button>
                    </div>
                </form>

                {/* Display Comments */}
                {comments.map((comment) => (
                    <div className="card" key={comment.id}>
                        <div className="card-block">
                            <p className="card-text">{comment.body}</p>
                        </div>
                        <div className="card-footer">
                            <a href={`/profile/${comment.author.username}`} className="comment-author">
                                <img src={comment.author.image || 'http://i.imgur.com/Qr71crq.jpg'} className="comment-author-img" />
                            </a>
                            &nbsp;
                            <a href={`/profile/${comment.author.username}`} className="comment-author">{comment.author.username}</a>
                            <span className="date-posted">{comment.createdAt}</span>

                            {/* Show delete option only for the comment owner */}
                            {user?.username === comment.author.username && (
                                <span className="mod-options" onClick={() => handleDeleteComment(comment.id)}>
                                    <i className="ion-trash-a" />
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comment