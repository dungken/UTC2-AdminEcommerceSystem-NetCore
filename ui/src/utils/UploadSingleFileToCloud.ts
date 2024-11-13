import axios from "axios";

export const UploadSingleFileToCloud = async (file: File, username?: string) => {
    const token = localStorage.getItem('token');
    const imageFormData = new FormData();
    imageFormData.append('file', file);

    // console.log(username);


    // Chỉ thêm userId vào form data nếu userId có giá trị
    if (username) {
        imageFormData.append('username', username);
    }

    const uploadResponse = await axios.post('/User/UploadImage', imageFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    });

    if (uploadResponse.status === 200) {
        return uploadResponse.data.url;
    } else {
        throw new Error('Backend upload failed.');
    }
};
