import { useContext, useEffect, useState } from 'react';
import { CommentInput } from '../components/CommentInput';
import { CommentList } from '../components/CommentList';

export interface Comment {
  id: number;
  text: string;
  editable: boolean;
}

const Comment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = (text: string) => {
    const newComment = { id: Date.now(), text, editable: false };
    setComments([...comments, newComment]);
  };
  return (
    <div className="main-container">
      <CommentList comments={comments} setComments={setComments} />
      <CommentInput onSubmit={handleSubmit} />
    </div>
  );
};

export default Comment;
