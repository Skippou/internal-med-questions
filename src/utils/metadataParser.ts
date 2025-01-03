export interface QuestionMetadata {
  id: string;
  specialty: string;
  topic: string;
  difficulty: string;
  tags: string[];
  created?: string;
  lastUpdated?: string;
}

export function parseMetadata(content: string): { metadata: QuestionMetadata; content: string } {
  const defaultMetadata: QuestionMetadata = {
    id: 'UNKNOWN',
    specialty: 'uncategorized',
    topic: 'general',
    difficulty: 'medium',
    tags: [],
  };

  try {
    const lines = content.split('\n');
    const headerMatch = content.match(/^(?:##?\s+)?(.+?)(?:\n\n|\n(?![\w-]+:))/s);
    
    if (!headerMatch) {
      return { metadata: defaultMetadata, content };
    }

    const metadataText = headerMatch[1];
    const mainContent = content.slice(headerMatch[0].length);
    const metadata: Partial<QuestionMetadata> = {};

    // Parse metadata string
    const metadataRegex = /(\w+):\s*([^\n]+?)(?=\s+\w+:|$)/g;
    let match;
    
    while ((match = metadataRegex.exec(metadataText)) !== null) {
      const [, key, value] = match;
      if (key === 'tags') {
        const tagsStr = value.trim().replace(/^\[|\]$/g, '');
        metadata.tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
      } else {
        metadata[key] = value.trim();
      }
    }

    return {
      metadata: { ...defaultMetadata, ...metadata } as QuestionMetadata,
      content: mainContent.trim()
    };
  } catch (error) {
    console.error('Error parsing metadata:', error);
    return { metadata: defaultMetadata, content };
  }
}

export function formatMetadata(metadata: QuestionMetadata): string {
  return `# Metadata
id: ${metadata.id}
specialty: ${metadata.specialty}
topic: ${metadata.topic}
difficulty: ${metadata.difficulty}
tags: [${metadata.tags.join(', ')}]
${metadata.created ? `created: ${metadata.created}` : ''}
${metadata.lastUpdated ? `lastUpdated: ${metadata.lastUpdated}` : ''}

`;
}
