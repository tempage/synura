const SYNURA = {
  name: "Source View Example",
  version: 1.0,
  api: 0,
  domain: "en.wikipedia.org",
  description: "Fetches Wikipedia pages to test source code highlighting.",
  license: "Apache-2.0",
  bypass: "firefox/android",
  get main() {
    return handler;
  }
};

const languages = [
  { id: 'html', name: 'HTML (Raw Source)', url: 'https://en.wikipedia.org/wiki/Main_Page' },
  { id: 'javascript', name: 'JavaScript', url: 'https://en.wikipedia.org/wiki/JavaScript' },
  { id: 'python', name: 'Python', url: 'https://en.wikipedia.org/wiki/Python_(programming_language)' },
  { id: 'go', name: 'Go', url: 'https://en.wikipedia.org/wiki/Go_(programming_language)' },
  { id: 'dart', name: 'Dart', url: 'https://en.wikipedia.org/wiki/Dart_(programming_language)' },
  { id: 'cpp', name: 'C++', url: 'https://en.wikipedia.org/wiki/C%2B%2B' },
  { id: 'rust', name: 'Rust', url: 'https://en.wikipedia.org/wiki/Rust_(programming_language)' },
  { id: 'java', name: 'Java', url: 'https://en.wikipedia.org/wiki/Java_(programming_language)' },
  { id: 'c', name: 'C', url: 'https://en.wikipedia.org/wiki/C_(programming_language)' },
  { id: 'csharp', name: 'C#', url: 'https://en.wikipedia.org/wiki/C_Sharp_(programming_language)' },
  { id: 'ruby', name: 'Ruby', url: 'https://en.wikipedia.org/wiki/Ruby_(programming_language)' },
  { id: 'php', name: 'PHP', url: 'https://en.wikipedia.org/wiki/PHP' },
  { id: 'swift', name: 'Swift', url: 'https://en.wikipedia.org/wiki/Swift_(programming_language)' },
  { id: 'kotlin', name: 'Kotlin', url: 'https://en.wikipedia.org/wiki/Kotlin_(programming_language)' },
  { id: 'bash', name: 'Shell (Bash)', url: 'https://en.wikipedia.org/wiki/Bash_(Unix_shell)' },
];

const handler = {
  home: function() {
    synura.open({
      view: '/views/list',
      styles: {
        title: "Source View Test",
        layout: "list"
      },
      models: {
        contents: languages.map(lang => ({
          title: lang.name,
          subtitle: lang.url,
          id: lang.id
        }))
      }
    }, { from: "home" }, this.onViewEvent);
  },

  onViewEvent: function(event) {
    if (event.eventId === "CLICK") {
      const selectedId = event.data.id;
      const lang = languages.find(l => l.id === selectedId);

      if (lang) {
        console.log(`Fetching ${lang.name} from ${lang.url}...`);

        try {
          const response = fetch(lang.url, {
            headers: {
              'User-Agent': 'SynuraTestClient/1.0 (https://github.com/my-user/synura; my-email@example.com)'
            }
          });
          let content = "";

          if (lang.id === 'html') {
            // For HTML, show the full raw source
            content = response.text();
          } else {
            // Standard extraction
            console.log(`Parsing ${lang.url}...`);
            const doc = response.dom();

            // Use div.mw-highlight as requested
            const selectors = ['div.mw-highlight', '.mw-highlight'];

            for (const selector of selectors) {
              if (content) break;
              const elements = doc.querySelectorAll(selector);
              console.log(`Found ${elements.length} elements for selector: ${selector}`);

              let longestText = "";

              for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
                if (el) {
                  // Try to get text. 
                  const rawText = el.text || el.textContent || el.innerText || "";
                  const text = rawText.trim();

                  if (text.length > longestText.length) {
                    longestText = text;
                  }
                }
              }

              if (longestText.length > 50) {
                content = longestText;
                console.log(`Found suitable code content. Length: ${content.length}`);
                break;
              }
            }

            if (!content) {
              const h1 = doc.querySelector('h1');
              let title = "Unknown Title";
              if (h1) {
                title = h1.text || h1.textContent || h1.innerText || "Title Found but Empty";
              }
              content = `// No code example found in the article.\n// Title: ${title}\n// URL: ${lang.url}\n// User-Agent: Firefox/Android`;
            }
          }

          synura.open({
            view: '/views/source',
            styles: {
              title: lang.name,
              language: lang.id === 'html' ? 'html' : lang.id, // Explicitly pass language
              lineNumbers: true,
              wordWrap: false
            },
            models: {
              content: content
            }
          });

        } catch (e) {
          console.log("Fetch error:", e);
          synura.open({
            view: '/views/list', // Re-open list or show error
            models: { snackbar: "Failed to fetch: " + e.toString() }
          });
        }
      }
    }
  }
};