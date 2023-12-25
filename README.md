ITSS Japanese 1

Installation
Step 1: Clone repository

git clone https://github.com/LeTruongLam/FoodMasterApp.git
Step 2: Setting server folder

cd server 
npm install
Step 3: Setting client folder
cd client 
npm install

Step 4: Setting database
import file Food.sql
Edit file server/db/index.js
const config = {
    host:"youhost",
    user:"youuser",
    password:"youpassword",
    database:"youdatabase"
}
Step 5 : Run
client: npm start
server: npm run dev
Step6 : Login with role admin
User: admin
Password: 1234
