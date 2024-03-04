const { BlobServiceClient } = require("@azure/storage-blob");

const deleteFile = async (fileUrl) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = "images"; // Use the name of your container
    const blobName = fileUrl.split("/").pop();

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.delete();
    } catch (err) {
        console.error(err);
    }
};

exports.deleteFile = deleteFile;

// const fs = require('fs');

// const deleteFile = (filePath) => {
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       throw err;
//     }
//   });
// };

// exports.deleteFile = deleteFile;
