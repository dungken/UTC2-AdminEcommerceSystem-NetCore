import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS cho giao diện soạn thảo

const TextEditor: React.FC = () => {

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video', 'color', 'background', 'align'
    ];

    const [content, setContent] = useState<string>('');

    const handleChange = (value: string) => {
        setContent(value);
    };

    return (
        <div style={{ height: '450px' }}>
            <ReactQuill
                value={content}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                style={{ height: '350px', width: '100%' }}
                placeholder='Detail description about your product...'
            />

            {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        </div>
    )
};

export default TextEditor;