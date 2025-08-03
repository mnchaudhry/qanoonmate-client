import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, Clock } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  helpfulCount: number;
}

interface Props {
  lawyerId: string;
}

const ReviewsSection = ({  }: Props) => {
  // Mock reviews data - replace with actual API call
  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Ahmad Hassan',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'Extremely professional and knowledgeable. Sarah helped me navigate through a complex property dispute with remarkable expertise. Her attention to detail and clear communication made the entire process smooth.',
      date: '2 days ago',
      isVerified: true,
      helpfulCount: 12
    },
    {
      id: '2',
      userName: 'Fatima Khan',
      userAvatar: '/api/placeholder/40/40',
      rating: 4,
      comment: 'Helped me resolve a family matter with ease. Very patient and understanding. The consultation was thorough and the advice was practical.',
      date: '1 week ago',
      isVerified: true,
      helpfulCount: 8
    },
    {
      id: '3',
      userName: 'Muhammad Ali',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      comment: 'Polite, punctual, and trustworthy. Highly recommended for criminal defense cases. Sarah\'s expertise and dedication to her clients is truly remarkable.',
      date: '2 weeks ago',
      isVerified: false,
      helpfulCount: 15
    }
  ];

  const overallRating = 4.8;
  const totalReviews = 48;

  const renderStars = (rating: number) => {
    const stars: any[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-warning-400 text-warning-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-warning-400/50 text-warning-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-secondary-300" />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="text-xl text-primary-900">Client Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              {renderStars(overallRating)}
            </div>
            <span className="text-2xl font-bold text-primary-900">
              {overallRating.toFixed(1)}
            </span>
            <span className="text-secondary-600">
              (based on {totalReviews} reviews)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.userAvatar} alt={review.userName} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {review.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-primary-900">{review.userName}</h4>
                    {review.isVerified && (
                      <Badge className="bg-success-100 text-success-700 border-success-200 text-xs">
                        Verified Client
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center gap-1 text-secondary-500">
                      <Clock className="w-3 h-3" />
                      <span className="text-sm">{review.date}</span>
                    </div>
                  </div>

                  <p className="text-secondary-700 mb-4 leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-secondary-600 hover:text-primary-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Helpful ({review.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;