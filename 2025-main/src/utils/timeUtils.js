// Hàm format thỞi gian ước tính (đơn vị phút)
export const formatEstimatedTime = (minutes) => {
  if (!minutes) return "N/A";

  if (minutes < 60) {
    return `${minutes} phút`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} giỞ`;
  }

  return `${hours} giỞ ${remainingMinutes} phút`;
};

// Hàm tính thỞi gian còn lại đến deadline
export const calculateTimeLeft = (deadline) => {
  if (!deadline) return "";

  const now = new Date().getTime();
  const deadlineTime = new Date(deadline).getTime();
  const difference = deadlineTime - now;

  if (difference <= 0) {
    return "Ğã quá hạn";
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes} phút`;
  }

  return `${hours} giỞ ${minutes} phút`;
};

// Hàm format thỞi gian hoạt động (giỞ:phút)
export const formatActivityTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

// Tạo số ngẫu nhiên trong khoảng [min, max)
export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Giới hạn giá trị trong khoảng min-max
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
