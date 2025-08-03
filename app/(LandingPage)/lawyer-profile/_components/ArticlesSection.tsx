import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Calendar } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  publication: string;
  date: string;
  excerpt: string;
  url?: string;
  category: string;
}

interface Props {
  lawyerId: string;
}

const ArticlesSection = ({ }: Props) => {
  // Mock articles data - replace with actual API call
  const articles: Article[] = [
    {
      id: '1',
      title: 'Understanding Property Law in Pakistan',
      publication: 'DAWN',
      date: 'March 2024',
      excerpt: 'A comprehensive guide to property rights, transfer procedures, and legal implications in Pakistani real estate law.',
      url: '#',
      category: 'Property Law'
    },
    {
      id: '2',
      title: 'Khula & Women\'s Rights in Islamic Law',
      publication: 'Express Tribune',
      date: 'January 2024',
      excerpt: 'Exploring the legal framework of Khula in Pakistan and the rights of women in divorce proceedings under Islamic jurisprudence.',
      url: '#',
      category: 'Family Law'
    },
    {
      id: '3',
      title: 'Criminal Defense Strategies in High Courts',
      publication: 'Legal Today',
      date: 'November 2023',
      excerpt: 'Effective defense strategies and case study analysis for criminal proceedings in Pakistani High Courts.',
      url: '#',
      category: 'Criminal Law'
    },
    {
      id: '4',
      title: 'Recent Amendments in Civil Procedure Code',
      publication: 'Pakistan Law Review',
      date: 'September 2023',
      excerpt: 'Analysis of recent amendments to CPC and their impact on civil litigation procedures in Pakistan.',
      url: '#',
      category: 'Civil Law'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Property Law': 'bg-primary-100 text-primary-700 border-primary-200',
      'Family Law': 'bg-secondary-100 text-secondary-700 border-secondary-200',
      'Criminal Law': 'bg-accent-100 text-accent-700 border-accent-200',
      'Civil Law': 'bg-success-100 text-success-700 border-success-200',
    };
    return colors[category as keyof typeof colors] || 'bg-secondary-100 text-secondary-700 border-secondary-200';
  };

  return (
    <Card className="border-primary-200">
      <CardHeader>
        <CardTitle className="text-xl text-primary-900 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Articles & Publications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="border-b border-secondary-200 last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-secondary-600">
                      Published in <strong>{article.publication}</strong>
                    </span>
                    <div className="flex items-center gap-1 text-secondary-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{article.date}</span>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(article.category)}>
                    {article.category}
                  </Badge>
                </div>

                {article.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 border-primary-200 text-primary-700 hover:bg-primary-50"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Article
                  </Button>
                )}
              </div>

              <p className="text-secondary-700 leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-600 mb-2">
              No Articles Published Yet
            </h3>
            <p className="text-secondary-500">
              Check back later for published articles and legal insights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticlesSection;