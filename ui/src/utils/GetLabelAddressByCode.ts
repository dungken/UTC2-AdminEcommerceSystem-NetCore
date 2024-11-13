import axios from 'axios';

const GetLabelAddressByCode = async (provinceCode: string, districtCode: string, communeCode: string) => {
    const provinceUrl = `https://vn-public-apis.fpo.vn/provinces/getByCode?code=${provinceCode}`;
    const districtUrl = `https://vn-public-apis.fpo.vn/districts/getByCode?code=${districtCode}`;
    const communeUrl = `https://vn-public-apis.fpo.vn/wards/getByCode?code=${communeCode}`;

    const [provinceResponse, districtResponse, communeResponse] = await Promise.all([
        axios.get(provinceUrl),
        axios.get(districtUrl),
        axios.get(communeUrl)
    ]);

    const province = provinceResponse.data;
    const district = districtResponse.data;
    const commune = communeResponse.data;

    return { province, district, commune };
};

export default GetLabelAddressByCode;