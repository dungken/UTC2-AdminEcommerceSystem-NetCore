import axios from "axios";

export const GetInforAddress = async (url: string, setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
        const response = await axios.get(url);
        const data = response.data.data.data;
        setData(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        setData([]);
    }
};