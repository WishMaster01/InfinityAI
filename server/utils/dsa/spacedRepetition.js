export const buildReviewSchedule = ({ cards = 10, start = new Date() } = {}) => {
  const intervals = [1, 3, 7, 14, 30];
  return intervals.map((days, index) => {
    const reviewAt = new Date(start);
    reviewAt.setUTCDate(reviewAt.getUTCDate() + days);
    return {
      round: index + 1,
      cards,
      intervalDays: days,
      reviewAt: reviewAt.toISOString().slice(0, 10),
    };
  });
};
