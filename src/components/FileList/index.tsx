import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { Container, FileInfo } from './styles';

interface FileProps {
  name: string;
  readableSize: string;
  id: string;
  updateProgress: 0 | number;
}

interface FileListProps {
  files: FileProps[];
}

const FileList: React.FC<FileListProps> = ({ files }: FileListProps) => {
  return (
    <Container>
      {files.map(uploadedFile => (
        <li key={uploadedFile.id}>
          <FileInfo>
            <div>
              <strong>{uploadedFile.name}</strong>
              <span>{uploadedFile.readableSize}</span>
            </div>
            {uploadedFile.updateProgress < 99 &&
              uploadedFile.updateProgress > 0 && (
                <CircularProgressbar
                  styles={{
                    root: { width: 24 },
                    path: { stroke: '#5636D3' },
                  }}
                  strokeWidth={15}
                  value={uploadedFile.updateProgress}
                />
              )}
            {uploadedFile.updateProgress > 99 && (
              <MdCheckCircle size={24} color="#78e5d5" />
            )}
            {uploadedFile.updateProgress < 0 && (
              <MdError size={24} color="#e57878" />
            )}
          </FileInfo>
        </li>
      ))}
    </Container>
  );
};

export default FileList;
