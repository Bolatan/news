import { useEffect, useState, useRef } from 'react';
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  type Article,
} from '@/lib/api';
import { CATEGORIES, COMMUNITIES } from '@/lib/utils';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Eye,
  FileText,
  Save,
  X,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  HelpCircle,
} from 'lucide-react';

type AdminPageProps = {
  onNavigate: (path: string) => void;
};

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tab & edit states
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<string>('Politics');
  const [community, setCommunity] = useState<string>('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [author, setAuthor] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [readTimeMinutes, setReadTimeMinutes] = useState(3);

  // Body editor tab (Edit vs. Preview)
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');

  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Load articles on mount
  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchArticles({ limit: 100 });
      setArticles(data);
    } catch {
      setErrorMsg('Could not load articles.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Set form states when editing or resetting
  const handleOpenCreateForm = () => {
    setEditingArticle(null);
    setTitle('');
    setSummary('');
    setBody('');
    setCategory('Politics');
    setCommunity('');
    setLocation('');
    setImageUrl('');
    setImageCredit('');
    setAuthor('');
    setTagsInput('');
    setIsFeatured(false);
    setIsBreaking(false);
    setReadTimeMinutes(3);
    setEditorTab('edit');
    setErrorMsg('');
    setView('form');
  };

  const handleOpenEditForm = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSummary(article.summary);
    setBody(article.body);
    setCategory(article.category);
    setCommunity(article.community || '');
    setLocation(article.location || '');
    setImageUrl(article.imageUrl || '');
    setImageCredit(article.imageCredit || '');
    setAuthor(article.author);
    setTagsInput((article.tags || []).join(', '));
    setIsFeatured(article.isFeatured);
    setIsBreaking(article.isBreaking);
    setReadTimeMinutes(article.readTimeMinutes);
    setEditorTab('edit');
    setErrorMsg('');
    setView('form');
  };

  const handleDelete = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteArticle(articleId);
      setSuccessMsg('Article deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
      loadArticles();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete article.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // HTML Toolbar helpers for rich text format
  const insertHTMLTag = (tag: string, placeholder = 'text') => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(startPos, endPos) || placeholder;

    let tagOpen = `<${tag}>`;
    let tagClose = `</${tag}>`;

    if (tag === 'link') {
      const url = window.prompt('Enter link URL:', 'https://');
      if (url === null) return;
      tagOpen = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline">`;
      tagClose = '</a>';
    } else if (tag === 'ul') {
      tagOpen = '<ul class="list-disc pl-5 my-3">\n  <li>';
      tagClose = '</li>\n</ul>';
    } else if (tag === 'ol') {
      tagOpen = '<ol class="list-decimal pl-5 my-3">\n  <li>';
      tagClose = '</li>\n</ol>';
    } else if (tag === 'h2') {
      tagOpen = '<h2 class="text-xl font-bold mt-4 mb-2 text-neutral-900">';
      tagClose = '</h2>';
    } else if (tag === 'h3') {
      tagOpen = '<h3 class="text-lg font-bold mt-3 mb-1.5 text-neutral-800">';
      tagClose = '</h3>';
    } else if (tag === 'p') {
      tagOpen = '<p class="text-neutral-800 leading-relaxed mb-4">';
      tagClose = '</p>';
    }

    const replacement = tagOpen + selectedText + tagClose;
    const newBody = currentText.substring(0, startPos) + replacement + currentText.substring(endPos);
    setBody(newBody);

    // Keep focus and select newly inserted tag
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + tagOpen.length, startPos + tagOpen.length + selectedText.length);
    }, 50);
  };

  // Handle Form Submission (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim() || !body.trim() || !category || !author.trim()) {
      setErrorMsg('Title, Body text, Category, and Author are required.');
      return;
    }

    setSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const articleData: Partial<Article> = {
      title: title.trim(),
      summary: summary.trim() || undefined, // server will generate if blank
      body: body.trim(),
      category,
      community: community || null,
      location: location.trim() || null,
      imageUrl: imageUrl.trim() || null,
      imageCredit: imageCredit.trim() || null,
      author: author.trim(),
      isFeatured,
      isBreaking,
      readTimeMinutes: Number(readTimeMinutes) || 3,
      tags,
    };

    try {
      if (editingArticle) {
        const id = editingArticle._id || editingArticle.id;
        if (!id) throw new Error('Article ID is missing.');
        await updateArticle(id, articleData);
        setSuccessMsg('Article updated successfully!');
      } else {
        await createArticle(articleData);
        setSuccessMsg('Article created successfully!');
      }

      setTimeout(() => setSuccessMsg(''), 4000);
      setView('list');
      loadArticles();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-4">
        <button onClick={() => onNavigate('/')} className="hover:text-red-600">
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-semibold">Admin Panel</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Content Management Dashboard
          </h1>
          <p className="text-neutral-500">
            Create, edit, or remove news articles and editorial items.
          </p>
        </div>
        {view === 'list' && (
          <button
            onClick={handleOpenCreateForm}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded transition-all text-sm shrink-0 self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Write Article
          </button>
        )}
      </div>

      {/* Messaging */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 flex justify-between items-center text-sm">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} aria-label="Dismiss error">
            <X className="w-4 h-4 text-red-700" />
          </button>
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6 flex justify-between items-center text-sm">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} aria-label="Dismiss success">
            <X className="w-4 h-4 text-green-700" />
          </button>
        </div>
      )}

      {/* Main Views */}
      {view === 'list' ? (
        loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-300 rounded-lg bg-neutral-50">
            <p className="text-neutral-500 mb-4">No editorial stories found in database.</p>
            <button
              onClick={handleOpenCreateForm}
              className="text-red-600 font-bold hover:underline"
            >
              Write your first article now
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 font-bold text-xs uppercase border-b border-neutral-200">
                    <th className="px-6 py-4">Title / Author</th>
                    <th className="px-6 py-4">Section / Area</th>
                    <th className="px-6 py-4">Tags</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm">
                  {articles.map((art) => (
                    <tr key={art.slug} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 max-w-sm">
                        <p className="font-semibold text-neutral-900 line-clamp-1">{art.title}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">By {art.author}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-neutral-100 text-neutral-800 text-xs font-semibold px-2 py-0.5 rounded">
                          {art.category}
                        </span>
                        {art.community && (
                          <span className="inline-block bg-red-50 text-red-700 text-xs font-semibold px-2 py-0.5 rounded ml-1.5">
                            {art.community}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {art.tags && art.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {art.tags.map((t) => (
                              <span
                                key={t}
                                className="text-xs bg-neutral-50 border border-neutral-200 text-neutral-600 rounded px-1.5"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400 font-italic">No tags</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {art.isAggregated ? (
                          <span className="text-xs text-amber-600 font-medium border border-amber-200 bg-amber-50 rounded px-2 py-0.5">
                            Aggregated Feed
                          </span>
                        ) : (
                          <span className="text-xs text-green-600 font-medium border border-green-200 bg-green-50 rounded px-2 py-0.5">
                            Editorial Original
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onNavigate(`/article/${art.slug}`)}
                            title="View Article"
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 rounded hover:text-neutral-900 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditForm(art)}
                            title="Edit Article"
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 rounded hover:text-red-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const id = art._id || art.id;
                              if (id) handleDelete(id);
                            }}
                            title="Delete Article"
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 rounded hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Create/Edit Form View */
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-neutral-900">
              {editingArticle ? 'Edit Editorial Article' : 'Write New Editorial Article'}
            </h2>
            <button
              type="button"
              onClick={() => setView('list')}
              className="flex items-center gap-1 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded text-sm transition-all"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Middle Column (Main text content) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Ikorodu Town Hall Refurbishment Completed"
                  className="w-full border border-neutral-300 rounded px-3 py-2 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-red-600 transition-all text-base font-semibold"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">
                  Standfirst / Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Enter a brief, punchy one-sentence summary to appear on article lists and cards."
                  rows={2}
                  className="w-full border border-neutral-300 rounded px-3 py-2 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-red-600 transition-all text-sm leading-relaxed resize-none"
                />
              </div>

              {/* Body in Rich Text Format */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-neutral-700">
                    Article Body <span className="text-red-500">*</span>
                  </label>
                  <div className="flex border border-neutral-200 rounded overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setEditorTab('edit')}
                      className={`flex items-center gap-1 px-3 py-1 font-semibold transition-colors ${
                        editorTab === 'edit'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Edit HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`flex items-center gap-1 px-3 py-1 font-semibold transition-colors ${
                        editorTab === 'preview'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Visual Preview
                    </button>
                  </div>
                </div>

                {editorTab === 'edit' ? (
                  <div className="border border-neutral-300 rounded overflow-hidden focus-within:border-red-600 transition-all bg-neutral-50">
                    {/* Rich Text Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 border-b border-neutral-200 bg-white text-neutral-700">
                      <button
                        type="button"
                        onClick={() => insertHTMLTag('b', 'bold text')}
                        title="Bold Text (<b>)"
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHTMLTag('i', 'italic text')}
                        title="Italic Text (<i>)"
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHTMLTag('p', 'paragraph')}
                        title="Paragraph (<p>)"
                        className="px-2 py-0.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 text-xs font-bold transition-colors"
                      >
                        P
                      </button>
                      <div className="w-px h-4 bg-neutral-200 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertHTMLTag('h2', 'Subheading')}
                        title="H2 Heading (<h2>)"
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Heading2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHTMLTag('h3', 'Sub-subheading')}
                        title="H3 Heading (<h3>)"
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Heading3 className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-neutral-200 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertHTMLTag('ul', 'bullet item')}
                        title="Bullet List (<ul>)"
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHTMLTag('ol', 'numbered item')}
                        title="Numbered List (<ol>)"
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHTMLTag('link', 'link label')}
                        title="Add Hyperlink (<a>)"
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      ref={bodyTextareaRef}
                      required
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your article content using the rich-text toolbar or directly write HTML tags (e.g. <b>, <i>, <p>, <a>)."
                      rows={14}
                      className="w-full bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400 outline-none text-sm leading-relaxed resize-y border-none"
                    />
                  </div>
                ) : (
                  <div className="border border-neutral-300 rounded bg-neutral-50 px-4 py-4 min-h-[360px] max-h-[480px] overflow-y-auto prose prose-lg">
                    {body.trim() ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: body }}
                        className="rich-text-preview text-neutral-800"
                      />
                    ) : (
                      <p className="text-neutral-400 italic text-sm">No body content written yet. Use the HTML tab to start writing.</p>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Rich text formats with tags like &lt;b&gt;, &lt;i&gt;, &lt;h2&gt;, &lt;p&gt;, and &lt;a&gt; are natively supported.</span>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar parameters) */}
            <div className="space-y-5 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500 border-b border-neutral-200 pb-1.5 mb-2">
                Article Details
              </h3>

              {/* Author */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Byline / Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., Bola Adekoya"
                  className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-red-600 bg-white text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900 outline-none focus:border-red-600 bg-white text-sm font-semibold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Community */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Ikorodu Community
                </label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900 outline-none focus:border-red-600 bg-white text-sm"
                >
                  <option value="">-- Select Community (Optional) --</option>
                  {COMMUNITIES.map((comm) => (
                    <option key={comm} value={comm}>
                      {comm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific Location */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Specific Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Tunga Road, Elepe"
                  className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-red-600 bg-white text-sm"
                />
              </div>

              {/* Comma separated Tags */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g., roads, repair, delay"
                  className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-red-600 bg-white text-sm"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Tags allow articles to be indexed and organized dynamically under hyperlinks.
                </span>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g., https://images.pexels.com/..."
                  className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-red-600 bg-white text-sm"
                />
              </div>

              {/* Image Credit */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Image Credit Line
                </label>
                <input
                  type="text"
                  value={imageCredit}
                  onChange={(e) => setImageCredit(e.target.value)}
                  placeholder="e.g., Richard Badejo"
                  className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-red-600 bg-white text-sm"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Read Time (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={readTimeMinutes}
                  onChange={(e) => setReadTimeMinutes(Number(e.target.value) || 3)}
                  className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900 outline-none focus:border-red-600 bg-white text-sm"
                />
              </div>

              {/* Checkboxes (Featured, Breaking) */}
              <div className="pt-2 border-t border-neutral-200 space-y-2.5 text-sm">
                <label className="flex items-center gap-2 font-medium text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-neutral-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                  />
                  Feature on Homepage
                </label>
                <label className="flex items-center gap-2 font-medium text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="rounded border-neutral-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                  />
                  Mark as Breaking News
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded transition-all shadow disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'Saving...' : editingArticle ? 'Update Article' : 'Publish Story'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
