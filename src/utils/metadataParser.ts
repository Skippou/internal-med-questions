export interface QuestionMetadata {
  id: string;
  specialty: string;
  topic: string;
  difficulty: string;
  tags: string[];
  created?: string;
  lastUpdated?: string;
}

type MetadataKey = keyof QuestionMetadata;

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
    const h2Regex = /^##\s+(.+)$/;
    let metadataText = '';
    let mainContent = content;

    // Find the metadata h2 block
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(h2Regex);
      if (match) {
        metadataText = match[1];
        mainContent = lines.slice(i + 1).join('\n');
        break;
      }
    }

    if (!metadataText) {
      console.warn('No metadata found in content');
      return { metadata: defaultMetadata, content: mainContent };
    }

    const metadata: Partial<QuestionMetadata> = {};
    const metadataLines = metadataText.split('\n');

    metadataLines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value && isMetadataKey(key)) {
        if (key === 'tags') {
          const tagsMatch = value.match(/\[(.*)\]/);
          metadata.tags = tagsMatch ? 
            tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : 
            defaultMetadata.tags;
        } else {
          metadata[key] = value;
        }
      }
    });

    return {
      metadata: { ...defaultMetadata, ...metadata } as QuestionMetadata,
      content: mainContent
    };
  } catch (error) {
    console.error('Error parsing metadata:', error);
    return { metadata: defaultMetadata, content };
  }
}

function isMetadataKey(key: string): key is MetadataKey {
  return ['id', 'specialty', 'topic', 'difficulty', 'tags', 'created', 'lastUpdated'].includes(key);
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
