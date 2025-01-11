export const checkFileValidation = (file: File):boolean => {
    // Validation: Check if file is an image and size is <= 10 MB
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    if (!validImageTypes.includes(file.type)) {
        throw new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed.");
    }

    if (file.size > maxFileSize) {
        throw new Error("File size must be less than or equal to 10 MB. Your size is " + (file.size / 1024 / 1024).toFixed(2) + " MB");
    }
    return true
}
