import React, { useState, useEffect } from 'react';
import { Upload, notification } from 'antd';
import uploadServices from 'src/services/uploadServices';
import setAuthToken from 'src/utils/setAuthToken';
import backend_api from '../../config';
import { isEmpty } from 'src/utils/isEmpty';

import './Chat.css';

const { Dragger } = Upload;

const Chat = ({ setLoading }) => {
  const [fileList, setFileList] = useState([]);
  const [fileArray, setFileArray] = useState(
    localStorage.getItem('fileArray')
      ? JSON.parse(localStorage.getItem('fileArray'))
      : []
  );

  const uploadProps = {
    name: 'file',
    action: backend_api + 'upload/multiple',
    multiple: true,
    fileList,
    onchange: (info) => {
      setFileList(info.fileList);
      const { status } = info.file;
      setLoading(true);
      if (status !== 'uploading') {
        console.log('uploading = ', info);
      }
      if (status === 'done') {
        setLoading(false);
        notification.success({
          description: `${info.file.response.originalname} Upload Success`,
          message: '',
          duration: 2,
        });
      } else if (status === 'error') {
        console.log('error');
        setLoading(false);
        notification.error({
          description: 'Upload Failed',
          message: '',
        });
      }
    },
    beforeUpload: async (file, fileList) => {
      setLoading(true);
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        setLoading(false);
        notification.warning({
          message: `${file.name} is not a pdf file`,
        });
        return Upload.LIST_IGNORE;
      } else {
        const formData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
          formData.append('file', fileList[i]);
        }
        console.log('FormData = ', formData.get('file'));

        try {
          const response = await fetch(backend_api + 'upload/multiple', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          setLoading(false);
          console.log('!!!!!!!! = ', data);
          if (!data) {
            notification.error({
              message: 'Error',
              description: 'File Upload Error',
              duration: 2,
            });
            return false;
          } else {
            if (data.code === 200) {
              notification.success({
                message: 'Success',
                description: 'Upload Success',
                duration: 2,
              });
              setFileArray(data.data);
              localStorage.setItem('fileArray', JSON.stringify(data.data));
              return false;
            } else {
              notification.error({
                message: 'Error',
                description: data.message,
                duration: 2,
              });
              return false;
            }
          }
        } catch (error) {
          setLoading(false);
          console.log('Fetch error = ', error);
        }
      }
      return false;
    },
    // onRemove: async (file) => {
    //   setAuthToken(localStorage.getItem('token'));
    //   try {
    //     const res = await axios.delete(
    //       `http://localhost:8080/api/embed_file/${file.uid}`
    //     );
    //     if (res.status === 200) {
    //       console.log('ok');
    //       props.setFlag(!props.flag);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  };

  useEffect(() => {
    setAuthToken(localStorage.getItem('token'));
  }, []);

  const handleEmbedding = (e) => {
    setLoading(true);
    e.preventDefault();
    uploadServices
      .embedding(JSON.parse(localStorage.getItem('fileArray')))
      .then((result) => {
        console.log('result = ', result);
        setLoading(false);
        notification.success({
          description: `${result.data}`,
          message: '',
        });
      })
      .catch((error) => {
        console.log('Emb = ', error);
        setLoading(false);
        notification.error({
          description: 'Someting went Wrong',
          message: '',
          duration: 2,
        });
      });
  };

  const handleCancel = (e) => {
    setFileArray([]);
    localStorage.removeItem('fileArray');
  };

  return (
    <div className="flex w-4/6 min-w-min">
      <div className="h-full flex flex-col flex-1 justify-between pl-24 pr-24 py-4 duration-500 overflow-hidden relative bg-white">
        <div className="h-full flex flex-col justify-center">
          {!isEmpty(fileArray) ? (
            <div className="flex flex-row w-full gap-5 justify-center">
              <button
                className="mt-4 tracking-wide font-semibold bg-green-400 text-white w-full p-4 rounded-lg hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.3),0_4px_18px_0_rgba(51,45,45,0.2)] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                onClick={(e) => handleEmbedding(e)}
              >
                Start Embedding
              </button>
              <button
                className="mt-4 tracking-wide font-semibold bg-red-900 text-white w-full p-4 rounded-lg hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.3),0_4px_18px_0_rgba(51,45,45,0.2)] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                onClick={(e) => handleCancel(e)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <Dragger
              {...uploadProps}
              className="mt-4 rounded-lg cursor-pointer bg-gray-50 h-32"
              maxCount={1}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon flex justify-center">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </p>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            </Dragger>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
