import type { Testimonial } from '../../lib/types';

export function TestimonialCard({ author_name, author_role, content, photo }: Testimonial) {
  return (
    <div className="border border-(--color-border) p-6 flex flex-col h-full">
      <p className="text-(--color-text-dim) leading-relaxed flex-1">&ldquo;{content}&rdquo;</p>
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-(--color-border)">
        {photo && <img src={photo} alt={author_name} className="h-10 w-10 rounded-full object-cover" />}
        <div>
          <p className="font-medium text-sm">{author_name}</p>
          {author_role && <p className="font-mono text-xs text-(--color-text-dim)">{author_role}</p>}
        </div>
      </div>
    </div>
  );
}
