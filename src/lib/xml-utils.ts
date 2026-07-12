// ==============================================
// DevForge — XML Formatter Pro Utilities
// ==============================================
// Pure XML beautification, minification, validation,
// tree structure parsing, and preset library.
// ==============================================

export interface XmlTreeNode {
  tag: string;
  attributes: Record<string, string>;
  text?: string;
  children: XmlTreeNode[];
}

export interface XmlPreset {
  name: string;
  sampleXml: string;
  description: string;
}

/**
 * Beautifies XML string with indentation.
 */
export function formatXml(
  input: string,
  indent = 2
): { isValid: boolean; output: string; error: string | null } {
  if (!input.trim()) {
    return { isValid: true, output: '', error: null };
  }

  // Check validation first
  const validation = validateXml(input);
  if (!validation.isValid) {
    return {
      isValid: false,
      output: input,
      error: validation.message,
    };
  }

  const padChar = ' '.repeat(indent);
  let padLevel = 0;
  const lines: string[] = [];

  // Normalize XML by putting tags on individual tokens
  const reg = /(>)(<)(\/*)/g;
  const xml = input.trim().replace(reg, '$1\r\n$2$3');

  xml.split(/\r?\n/).forEach((nodeLine) => {
    const line = nodeLine.trim();
    if (!line) return;

    let indentChange = 0;

    if (line.match(/^<\/\w/)) {
      // Closing tag </tag> decreases indent before line
      padLevel = Math.max(0, padLevel - 1);
    } else if (
      line.match(/^<\w[^>]*[^\/]>.*<\/\w[^>]*>$/) || // Self contained <tag>content</tag>
      line.match(/^<\w[^>]*\/>$/) || // Self closing <tag/>
      line.match(/^<\?xml/) || // Processing instruction <?xml ... ?>
      line.match(/^<!--/) // Comment
    ) {
      indentChange = 0;
    } else if (line.match(/^<\w/)) {
      // Opening tag increases indent for subsequent lines
      indentChange = 1;
    }

    lines.push(padChar.repeat(padLevel) + line);
    padLevel += indentChange;
  });

  return {
    isValid: true,
    output: lines.join('\n'),
    error: null,
  };
}

/**
 * Minifies XML string by stripping inter-tag whitespace.
 */
export function minifyXml(
  input: string
): { isValid: boolean; output: string; error: string | null } {
  if (!input.trim()) {
    return { isValid: true, output: '', error: null };
  }

  const validation = validateXml(input);
  if (!validation.isValid) {
    return {
      isValid: false,
      output: input,
      error: validation.message,
    };
  }

  const minified = input
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();

  return {
    isValid: true,
    output: minified,
    error: null,
  };
}

/**
 * Validates basic XML structure and unclosed/mismatched tags.
 */
export function validateXml(input: string): {
  isValid: boolean;
  message: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, message: 'XML document is empty.' };
  }

  // Browser DOMParser validation if window is available
  if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
    try {
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(trimmed, 'application/xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        return {
          isValid: false,
          message: parserError.textContent ?? 'Malformed XML syntax',
        };
      }
      return { isValid: true, message: 'Valid XML document.' };
    } catch {
      // Fall through to regex stack validation
    }
  }

  // Server / portable stack-based validation
  const tagRegex = /<\/?([a-zA-Z0-9_:-]+)[^>]*\/?>/g;
  const stack: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(trimmed)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];

    if (
      fullTag.startsWith('<?') ||
      fullTag.startsWith('<!') ||
      fullTag.endsWith('/>')
    ) {
      continue;
    }

    if (fullTag.startsWith('</')) {
      if (stack.length === 0) {
        return {
          isValid: false,
          message: `Unexpected closing tag </${tagName}> without matching opening tag.`,
        };
      }
      const last = stack.pop();
      if (last !== tagName) {
        return {
          isValid: false,
          message: `Mismatched closing tag </${tagName}>. Expected </${last}>.`,
        };
      }
    } else {
      stack.push(tagName);
    }
  }

  if (stack.length > 0) {
    return {
      isValid: false,
      message: `Unclosed tag <${stack[stack.length - 1]}>.`,
    };
  }

  return {
    isValid: true,
    message: 'Valid XML document.',
  };
}

/**
 * Parses XML into a basic tree representation for UI exploration.
 */
export function parseXmlToTree(input: string): XmlTreeNode | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
    try {
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(trimmed, 'application/xml');
      if (doc.querySelector('parsererror')) return null;

      const rootElem = doc.documentElement;
      if (!rootElem) return null;

      const domNodeToTree = (node: Element): XmlTreeNode => {
        const attributes: Record<string, string> = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          attributes[attr.name] = attr.value;
        }

        const children: XmlTreeNode[] = [];
        let textContent = '';

        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === 1) {
            children.push(domNodeToTree(child as Element));
          } else if (child.nodeType === 3) {
            const txt = child.textContent?.trim();
            if (txt) textContent += txt;
          }
        }

        return {
          tag: node.nodeName,
          attributes,
          text: textContent || undefined,
          children,
        };
      };

      return domNodeToTree(rootElem);
    } catch {
      return null;
    }
  }

  // Fallback simple tree node for SSR environments
  return {
    tag: 'xml-document',
    attributes: {},
    text: 'XML Tree View is interactive in browser mode.',
    children: [],
  };
}

export const XML_PRESETS: XmlPreset[] = [
  {
    name: 'Maven POM',
    sampleXml: `<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.devforge</groupId>
  <artifactId>devforge-core</artifactId>
  <version>1.0.0</version>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>3.2.0</version>
    </dependency>
  </dependencies>
</project>`,
    description: 'Standard Java Maven project configuration (pom.xml)',
  },
  {
    name: 'SOAP Envelope',
    sampleXml: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <AuthToken>devforge-secret-token</AuthToken>
  </soap:Header>
  <soap:Body>
    <GetUserRequest>
      <UserId>42</UserId>
    </GetUserRequest>
  </soap:Body>
</soap:Envelope>`,
    description: 'XML SOAP web service request payload',
  },
  {
    name: 'RSS Feed',
    sampleXml: `<rss version="2.0">
  <channel>
    <title>DevForge Tech News</title>
    <link>https://devforge.app</link>
    <description>Latest tools and updates for developers</description>
    <item>
      <title>Announcing DevForge v1.0</title>
      <link>https://devforge.app/releases/v1.0</link>
      <pubDate>Mon, 12 Jul 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`,
    description: 'Standard RSS 2.0 syndication feed',
  },
  {
    name: 'Android Layout',
    sampleXml: `<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
  <TextView
      android:id="@+id/titleText"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="Welcome to DevForge" />
</LinearLayout>`,
    description: 'Android XML UI layout snippet',
  },
  {
    name: 'Sitemap XML',
    sampleXml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://devforge.app</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://devforge.app/dashboard/tools</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`,
    description: 'SEO Website Sitemap XML document',
  },
];
