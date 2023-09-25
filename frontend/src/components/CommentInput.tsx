import React from 'react';
import { CommentList } from './CommentList';
import { useContext, useEffect, useState } from 'react';

export interface CommentInputProps {
  onSubmit: (text: string) => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({ onSubmit }) => {
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isFormDisabled) {
      e.preventDefault(); // prevent form submission
      return;
    }
    e.preventDefault();
    onSubmit(text);
    setText('');
  };
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input-box"
      />
      <button className="comment-button>">Submit</button>
    </form>
  );
};
