interface UserRole {
    name: string;
}



interface User {
    id: number;
    profilePicture: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    userRoles: UserRole[];
    isDeleted: string;
    provinceCode: string;
    districtCode: string;
    communeCode: string;
    fullAddress: string;
    phoneNumber: string;
    dateOfBirth: string;
    status: 'Active' | 'Pending' | 'Inactive';
    roleName: string;
    createdAt: string;
    updatedAt: string;
}

export default User;