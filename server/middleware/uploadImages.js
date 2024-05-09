const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dcc0yhyjq",
  api_key: "935837415978238",
  api_secret: "xRmHSf79k7vWqW8OiwgD1FH8a0E",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Product Images", // Tên thư mục trên Cloudinary để lưu trữ các ảnh sản phẩm
    allowed_formats: ["jpg", "jpeg", "png"], // Định dạng tệp cho phép
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Chỉnh sửa kích thước ảnh
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
