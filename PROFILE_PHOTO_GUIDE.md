# Profile Photo Upload Guide

Complete guide for uploading, changing, and managing user profile photos.

## Overview

Users can now upload, change, and delete their profile photos. Photos are stored in the `uploads/` directory and served as static files.

## Features

- ✅ Upload profile photo
- ✅ Change/update existing photo (automatically deletes old one)
- ✅ Delete profile photo
- ✅ Automatic file cleanup on errors
- ✅ Image validation (JPEG, JPG, PNG, GIF, WEBP)
- ✅ File size limit (5MB)
- ✅ Unique filenames per user
- ✅ Swagger documentation

## API Endpoints

### Upload Profile Photo

**POST** `/api/auth/profile/photo`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Body (form-data):**
- `photo` (file): Image file to upload

**Response (200):**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "user": {
      "uid": "...",
      "email": "...",
      "name": "...",
      "photoPath": "/uploads/user_abc123_1234567890.jpg"
    },
    "photoPath": "/uploads/user_abc123_1234567890.jpg"
  }
}
```

### Delete Profile Photo

**DELETE** `/api/auth/profile/photo`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Photo deleted successfully",
  "data": {
    "user": {
      "uid": "...",
      "email": "...",
      "photoPath": null
    }
  }
}
```

## Testing with cURL

### Upload Photo

```bash
curl -X POST http://localhost:3000/api/auth/profile/photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "photo=@/path/to/your/image.jpg"
```

### Delete Photo

```bash
curl -X DELETE http://localhost:3000/api/auth/profile/photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing with Swagger UI

1. **Open Swagger UI**: http://localhost:3000/api-docs
2. **Authorize**: Click "Authorize" and enter your JWT token
3. **Test Upload**:
   - Find `POST /api/auth/profile/photo`
   - Click "Try it out"
   - Click "Choose File" and select an image
   - Click "Execute"
4. **Test Delete**:
   - Find `DELETE /api/auth/profile/photo`
   - Click "Try it out"
   - Click "Execute"

## File Specifications

### Allowed Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WEBP (.webp)

### File Size Limit
- Maximum: 5MB

### File Naming
Files are automatically renamed to:
```
user_{USER_UID}_{TIMESTAMP}.{EXTENSION}
```

Example: `user_abc123xyz_1699123456789.jpg`

## File Storage

### Directory Structure
```
astronacci/
├── uploads/
│   ├── .gitkeep
│   ├── user_abc123_1699123456789.jpg
│   ├── user_def456_1699123567890.png
│   └── ...
```

### Static File Access
Photos are served at:
```
http://localhost:3000/uploads/user_abc123_1699123456789.jpg
```

### Database Storage
Only the file path is stored in Firestore:
```javascript
{
  uid: "abc123",
  email: "user@example.com",
  name: "John Doe",
  photoPath: "/uploads/user_abc123_1699123456789.jpg"
}
```

## Automatic Cleanup

### On Upload Error
If the upload fails, the uploaded file is automatically deleted to prevent orphaned files.

### On Photo Replacement
When a user uploads a new photo, the old photo is automatically deleted from the filesystem.

### On Photo Deletion
When a user deletes their photo, the file is removed from both the filesystem and database.

## Error Handling

### No File Uploaded
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

### Invalid File Type
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP are allowed."
}
```

### File Too Large
```json
{
  "success": false,
  "message": "File too large"
}
```

### No Photo to Delete
```json
{
  "success": false,
  "message": "No photo to delete"
}
```

## Security Features

- **Authentication Required**: All photo endpoints require JWT authentication
- **File Type Validation**: Only allowed image formats accepted
- **File Size Limits**: Prevents abuse of storage
- **Unique Filenames**: Prevents filename collisions
- **Automatic Cleanup**: Prevents orphaned files

## Implementation Details

### Middleware (`middleware/upload.js`)
- Configures multer for file uploads
- Validates file types
- Sets file size limits
- Creates unique filenames

### Controller (`controllers/authController.js`)
- `uploadPhoto`: Handles photo upload and database update
- `deletePhoto`: Handles photo deletion from filesystem and database

### Static File Serving (`server.js`)
```javascript
app.use("/uploads", express.static("uploads"));
```

## Frontend Integration Example

### JavaScript/Fetch

```javascript
// Upload photo
const formData = new FormData();
formData.append('photo', fileInput.files[0]);

fetch('http://localhost:3000/api/auth/profile/photo', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));

// Delete photo
fetch('http://localhost:3000/api/auth/profile/photo', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### React Example

```jsx
import React, { useState } from 'react';

function ProfilePhotoUpload({ token }) {
  const [file, setFile] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('http://localhost:3000/api/auth/profile/photo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      setPhotoPath(data.data.photoPath);
      alert('Photo uploaded!');
    }
  };

  const handleDelete = async () => {
    const response = await fetch('http://localhost:3000/api/auth/profile/photo', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (data.success) {
      setPhotoPath(null);
      alert('Photo deleted!');
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {photoPath && (
        <>
          <img src={`http://localhost:3000${photoPath}`} alt="Profile" />
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}
```

## Production Considerations

### Storage Options
For production, consider:
- **Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob
- **CDN**: CloudFront, Cloudflare
- **Local Storage**: File system (current implementation)

### Security Enhancements
- Add virus scanning for uploaded files
- Implement rate limiting for uploads
- Add image compression/optimization
- Use signed URLs for temporary access
- Implement access control for photos

### Performance
- Compress images on upload
- Generate thumbnails
- Cache static files
- Use CDN for delivery

## Troubleshooting

### "No file uploaded" error
- Make sure the form field is named `photo`
- Check that the file is being sent in multipart/form-data

### File not accessible
- Verify `uploads` directory exists
- Check file permissions
- Ensure static file serving is configured

### Photo not deleting
- Check file permissions on uploads directory
- Verify photoPath in database
- Check server logs for errors

## Additional Resources

- [Multer Documentation](https://github.com/expressjs/multer)
- [Swagger UI](http://localhost:3000/api-docs)
- [API Testing Guide](API_TESTING.md)

