CHECKLIST:

+ WEB (11/11 - 17/11)
    * Hoan thanh thiet ke giao dien (11/11, 12/11, 13/11)
        - Quan tri:
            + Account => OKE
            + User => OKE
            + Role => OKE
            + Permission => OKE
            + Product Category
            + Product
            + Order
            + Customer
            + Discount
            + Inventory
            + Support and Feedback
            + Dashboard
        - Nguoi dung cuoi: 
            + Account
            + Home
            + Product
            + Cart
            + ...

    * Hoan thanh viet APIs -> Deploy (14/11, 15/11)
        - APIs: 
            * Account Controller
                + Login
                    > Check basic infor
                    > Check Account IsDeleted 
                    > Check Email Confirmed
                    > Check Enabled 2FA - Verify 2FA 
                    
                + Register 
                    > Check username/email existing
                    > Check Account IsDeleted
                    > Email Confirmed
                    > Verify email confirmed

                + Social Login
                    > Check username/email existing
                        > true: Login
                        > false: Social Register
                    > Social Register
                        > Check Account IsDeleted
                        > Email Confirmed
                        > Verify email confirmed

                + Forgot password
                    > Check email is existing
                        > false: stop
                        > true: send link confirmed 
                            > reset password
                
                + Logout 
                    > 

                + Change Password
                    > Check current password
                    > Change new password
                
                + Two factor authentication
                    > Turn on 2FA
                    > Verify 2FA
                    > Turn off 2FA
                
                + Delete account
                    > 
            
            * User Controller
                + Show Profile
                    > Get Personal Information
                
                + Edit Profile 
                    > Update Personal Information
                        > Update Avatar
                        > Update Basic Personal Information

                + Create User
                    > Check username/email existing
                        > true: stop
                        > false: 
                            > Get role list
                            > Create + Assign roles to user
                
                + View Users
                    > Get user list (pagging)
                    > Get user by ID/username/email
                    > Get roles by user
                    > Get users by status (Active, Inactive, Pending)
                    > Get users by role

                + Search user
                    > Search user by username/email

                + Edit user
                    > Check username/email is existing + diference current username/email
                
                + Delete user
                    > Check user is current user? 
                        > true: stop
                        > false: delete

            * Role Controller
                + Create Role
                    > Check role existing
                    > Get Permissions
                    > Assign Permissions to Role

                + View Roles
                    > Get Roles
                    > Get Permissions by Role
                    > Get Users by Role
                
                + Edit Role
                    > Get Permissions by Role
                    > Check role existing + difference with current role to update
                    > Update

                + Delete Role
                    > Check Role is containing users? 
                        > false: delete role
                        > true: stop

            * Permission Controller
                + Create Permission
                    > Check permission existing
                    > Create 

                + View Permissions
                    > Get permissions
                    > Get Roles by permission
                    > Get Users by permission

                + Edit permission
                    > Check permission existing + difference with current permission to update
                    > Save
                
                + Delete permission
                    > Check permission is belong to roles? 
                        > true: stop
                        > false: delete
                
            * Product Category Controller
                + Create Category
                    > Check category existing
                        > true: stop
                        > false: create
                
                + View Category
                    > Get Categories
                    > Get Products belong to category
                
                + Search/Filter Category
                    > Search by Name
                    > Filter by Status
                
                + Edit Category
                    > Check category existing
                        > true: stop
                        > false: update
                
                + Delete Category
                    > Check category is containing products? 
                        > true: alert if delete category then delete all relate to products
                        > false: delete

            * Product Controller
                + Create Product
                    > Get Product Categories
                    > Create new
                
                + View Product
                    > Get Products
                    > Get Product By ID
                    > Get Products by Category
                    > Get number of users bought Product
                    > Get total size products (M, L, X,....)
                    > Get total color products (red, orange, ....)
                    > Get discounts info by product
                    > Get relate to product images by product
                    > Get comments/feedback by product
                    > Get order by product
                    > 
                
                + Search/Filter
                    > Search products by Name
                    > Filter product by color/size/discount/category
                    > Search product sold with largest ordered
                    
                + Edit Product
                + Delete Product
                
            * Discount Controller
                + Create Discount
                + View Discount
                + Edit Discount
                + Delete Discount
            
            * Payment Controller 
                + Transaction payment 

            * Order Controller
                + View order
                S
            * Support Controller
                + Number of request to support

            * Dashboard Controller 
                + View number of order
                + View number of user/customer
                + View revenue
                + Export report/excel/pdf,...

    * APIs + UI (16/11, 17/11)



+ Windows Form (18/11 - 24/11)
    * APIs + UI 
