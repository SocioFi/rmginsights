import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { ArrowRight, Brain } from 'lucide-react';

interface NewsCardProps {
  category: string;
  categoryColor: string;
  image: string;
  title: string;
  summary: string;
  source: string;
  isAIInsight?: boolean;
  aiInsightText?: string;
  onReadStory?: () => void;
}

export function NewsCard({
  category,
  categoryColor,
  image,
  title,
  summary,
  source,
  isAIInsight,
  aiInsightText,
  onReadStory,
}: NewsCardProps) {
  if (isAIInsight && aiInsightText) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/10 border-2 border-[#EAB308]/30 rounded-2xl p-6 flex items-center gap-4"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-[#EAB308] rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#101725]" />
        </div>
        <div>
          <p className="text-[#EAB308] mb-2">🧠 MARBIM Insight</p>
          <p className="text-[#101725]">{aiInsightText}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge
            className="rounded-lg"
            style={{ backgroundColor: categoryColor, color: 'white' }}
          >
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 
          onClick={onReadStory}
          className="text-[#101725] dark:text-[#F9FAFB] line-clamp-2 cursor-pointer hover:text-[#EAB308] dark:hover:text-[#EAB308] transition-colors"
        >
          {title}
        </h3>

        <p className="text-[#6F83A7] text-sm line-clamp-3">
          {summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-[#6F83A7]">{source}</p>
          <motion.button
            onClick={onReadStory}
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-[#57ACAF] hover:text-[#57ACAF]/80 transition-colors"
          >
            Read Full Story
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
