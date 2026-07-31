import { useState, useEffect } from 'react';
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchSettings,
  updateSettings,
  uploadMediaFile,
  type Article,
  type User,
} from '@/lib/api';
import { CATEGORIES, COMMUNITIES } from '@/lib/utils';
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  User as UserIcon,
  Video,
  Image,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'users' | 'settings'>('articles');

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleSearch, setArticleSearch] = useState('');
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Settings state
  const [settings, setSettings] = useState<{
    pinnedHeroArticleId: string | null;
    pinnedHeroType: 'none' | 'article';
  }>({ pinnedHeroArticleId: null, pinnedHeroType: 'none' });
  const [loadingSettings, setLoadingSettings] = useState(true);

  // File upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Article Form Fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [community, setCommunity] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [location, setLocation] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [readTimeMinutes, setReadTimeMinutes] = useState(3);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState<'none' | 'youtube' | 'upload'>('none');
  const [mediaToDisplay, setMediaToDisplay] = useState<'image' | 'video'>('image');

  // User Form Fields
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Editor');
  const [userStatus, setUserStatus] = useState('Active');

  useEffect(() => {
    loadArticles();
    loadUsers();
    loadSettings();
  }, []);

  const loadArticles = async () => {
    setLoadingArticles(true);
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch {
      // ignore
    }
    setLoadingArticles(false);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      // ignore
    }
    setLoadingUsers(false);
  };

  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch {
      // ignore
    }
    setLoadingSettings(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadMediaFile(file);
      setImageUrl(res.url);
    } catch {
      alert('Failed to upload image');
    }
    setUploadingImage(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const res = await uploadMediaFile(file);
      setVideoUrl(res.url);
      setVideoType('upload');
    } catch {
      alert('Failed to upload video');
    }
    setUploadingVideo(false);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const articleData = {
      title,
      summary,
      body,
      category,
      imageUrl: imageUrl || null,
      imageCredit: imageCredit || null,
      author,
      location: location || null,
      community: community || null,
      isFeatured,
      isBreaking,
      readTimeMinutes,
      videoUrl: videoUrl || null,
      videoType,
      mediaToDisplay,
    };

    try {
      if (editingArticle) {
        // Edit
        const id = editingArticle._id || editingArticle.id || editingArticle.slug;
        await updateArticle(id, articleData);
      } else {
        // Create
        await createArticle(articleData);
      }
      setIsArticleModalOpen(false);
      loadArticles();
    } catch {
      alert('Failed to save article');
    }
  };

  const openArticleModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setTitle(article.title || '');
      setSummary(article.summary || '');
      setBody(article.body || '');
      setCategory(article.category || CATEGORIES[0]);
      setCommunity(article.community || '');
      setImageUrl(article.imageUrl || '');
      setImageCredit(article.imageCredit || '');
      setAuthor(article.author || 'Admin');
      setLocation(article.location || '');
      setIsFeatured(article.isFeatured || false);
      setIsBreaking(article.isBreaking || false);
      setReadTimeMinutes(article.readTimeMinutes || 3);
      setVideoUrl(article.videoUrl || '');
      setVideoType(article.videoType || 'none');
      setMediaToDisplay(article.mediaToDisplay || 'image');
    } else {
      setEditingArticle(null);
      setTitle('');
      setSummary('');
      setBody('');
      setCategory(CATEGORIES[0]);
      setCommunity('');
      setImageUrl('');
      setImageCredit('');
      setAuthor('Admin');
      setLocation('');
      setIsFeatured(false);
      setIsBreaking(false);
      setReadTimeMinutes(3);
      setVideoUrl('');
      setVideoType('none');
      setMediaToDisplay('image');
    }
    setIsArticleModalOpen(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteArticle(id);
      loadArticles();
    } catch {
      alert('Failed to delete article');
    }
  };

  // User Actions
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name: userName,
      email: userEmail,
      role: userRole,
      status: userStatus,
    };

    try {
      if (editingUser) {
        await updateUser(editingUser._id!, userData);
      } else {
        await createUser(userData);
      }
      setIsUserModalOpen(false);
      loadUsers();
    } catch {
      alert('Failed to save user');
    }
  };

  const openUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserRole(user.role);
      setUserStatus(user.status);
    } else {
      setEditingUser(null);
      setUserName('');
      setUserEmail('');
      setUserRole('Editor');
      setUserStatus('Active');
    }
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch {
      alert('Failed to delete user');
    }
  };

  // Settings Actions
  const handleUpdateHeroSettings = async (articleId: string | null, type: 'none' | 'article') => {
    try {
      await updateSettings({
        pinnedHeroArticleId: articleId,
        pinnedHeroType: type,
      });
      loadSettings();
      alert('Hero News configuration updated successfully!');
    } catch {
      alert('Failed to update Hero News settings');
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(articleSearch.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-neutral-500 text-sm">Manage news stories, community editors, and homepage media layout.</p>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'articles' ? 'bg-white shadow-sm text-red-600' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            News Articles
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'users' ? 'bg-white shadow-sm text-red-600' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Users/Editors
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-white shadow-sm text-red-600' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Homepage Hero Config
          </button>
        </div>
      </div>

      {/* ARTICLES TAB */}
      {activeTab === 'articles' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles by title or category..."
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-1 focus:ring-red-600 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadArticles}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-600"
                title="Refresh articles list"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => openArticleModal()}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add News Article
              </button>
            </div>
          </div>

          {loadingArticles ? (
            <div className="py-20 text-center text-neutral-500">Loading articles...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-neutral-200 rounded-lg text-neutral-500">
              No articles found matching the query. Click "Add News Article" to create your first post!
            </div>
          ) : (
            <div className="overflow-x-auto border border-neutral-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-xs">
                    <th className="px-6 py-3">Article Details</th>
                    <th className="px-6 py-3">Category / Community</th>
                    <th className="px-6 py-3">Status Flags</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredArticles.map((article) => {
                    const artId = article._id || article.id || article.slug;
                    return (
                      <tr key={artId} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded bg-neutral-200 overflow-hidden flex-shrink-0">
                              {article.imageUrl ? (
                                <img
                                  src={article.imageUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-neutral-900 line-clamp-1">{article.title}</p>
                              <p className="text-xs text-neutral-500">By {article.author} · {new Date(article.publishedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded font-semibold">
                            {article.category}
                          </span>
                          {article.community && (
                            <span className="ml-2 bg-neutral-100 text-neutral-600 text-xs px-2.5 py-1 rounded">
                              {article.community}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {article.isFeatured && (
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded font-medium">
                                Featured
                              </span>
                            )}
                            {article.isBreaking && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded font-medium">
                                Breaking
                              </span>
                            )}
                            {article.videoUrl && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                Video
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openArticleModal(article)}
                              className="p-1.5 border border-neutral-300 rounded hover:bg-neutral-50 text-neutral-700 hover:text-red-600 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(artId)}
                              className="p-1.5 border border-neutral-300 rounded hover:bg-red-50 text-neutral-700 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Manage Community Editors</h2>
            <button
              onClick={() => openUserModal()}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add User/Editor
            </button>
          </div>

          {loadingUsers ? (
            <div className="py-20 text-center text-neutral-500">Loading users...</div>
          ) : (
            <div className="overflow-x-auto border border-neutral-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-xs">
                    <th className="px-6 py-3">User Details</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900">{user.name}</p>
                            <p className="text-xs text-neutral-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-neutral-800">{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openUserModal(user)}
                            className="p-1.5 border border-neutral-300 rounded hover:bg-neutral-50 text-neutral-700 hover:text-red-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id!)}
                            className="p-1.5 border border-neutral-300 rounded hover:bg-red-50 text-neutral-700 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* HOMEPAGE CONFIG TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-600" />
              Homepage Hero Layout Control
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Override the standard news layout algorithm and pin a specific article with custom media (RSS feeds, Youtube videos, or device-uploaded media) onto the Hero banner on top.
            </p>

            {loadingSettings ? (
              <div className="text-center text-neutral-500 py-6">Loading config...</div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Select Pinned Hero Mode:</label>
                  <select
                    value={settings.pinnedHeroType}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pinnedHeroType: e.target.value as 'none' | 'article',
                      })
                    }
                    className="max-w-md w-full border border-neutral-300 rounded-lg p-2 bg-white text-sm focus:ring-1 focus:ring-red-600 outline-none"
                  >
                    <option value="none">Disabled (Show latest featured article)</option>
                    <option value="article">Enabled (Pin selected article from below)</option>
                  </select>
                </div>

                {settings.pinnedHeroType === 'article' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-700">Select Article to Pin as Hero:</label>
                    <select
                      value={settings.pinnedHeroArticleId || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pinnedHeroArticleId: e.target.value || null,
                        })
                      }
                      className="max-w-md w-full border border-neutral-300 rounded-lg p-2 bg-white text-sm focus:ring-1 focus:ring-red-600 outline-none"
                    >
                      <option value="">-- Choose Article --</option>
                      {articles.map((art) => (
                        <option key={art._id || art.id || art.slug} value={art._id || art.id || art.slug}>
                          [{art.category}] {art.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => handleUpdateHeroSettings(settings.pinnedHeroArticleId, settings.pinnedHeroType)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Save Layout Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ARTICLE CREATE / EDIT MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">
                {editingArticle ? 'Edit Article Details' : 'Create New News Article'}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveArticle} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-700">Headline/Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600"
                    placeholder="Enter article headline..."
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-700">Author *</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="border border-neutral-300 rounded-lg p-2 text-sm bg-white outline-none focus:ring-1 focus:ring-red-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-700">Ikorodu Community</label>
                  <select
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="border border-neutral-300 rounded-lg p-2 text-sm bg-white outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="">-- None --</option>
                    {COMMUNITIES.map((comm) => (
                      <option key={comm} value={comm}>
                        {comm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-700">Location In Community</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600"
                    placeholder="e.g. Ijede Road, Ebute"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-700">Estimated Read Time (Minutes)</label>
                  <input
                    type="number"
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    min={1}
                    className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700">Summary / Standfirst (Short deck)</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="Summarize the core story for cards..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700">Full Body Article (Markdown style support) *</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  rows={6}
                  className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="Type the full article here. Break paragraphs with empty lines..."
                />
              </div>

              {/* MEDIA CONFIGURATION */}
              <div className="border-t border-neutral-200 pt-4 space-y-4">
                <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-red-600" />
                  Media Attachment Controls
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image attachment */}
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3">
                    <span className="text-xs font-bold text-neutral-700 block">Image Media Attachment</span>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Image URL</label>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="border border-neutral-300 rounded-lg p-1.5 text-xs outline-none focus:ring-1 focus:ring-red-600"
                        placeholder="Paste image web URL..."
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Or Upload from Device</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-xs"
                      />
                      {uploadingImage && <span className="text-xs text-red-600 animate-pulse">Uploading Image...</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Photo Credit</label>
                      <input
                        type="text"
                        value={imageCredit}
                        onChange={(e) => setImageCredit(e.target.value)}
                        className="border border-neutral-300 rounded-lg p-1.5 text-xs outline-none focus:ring-1 focus:ring-red-600"
                        placeholder="Photo credit byline..."
                      />
                    </div>
                  </div>

                  {/* Video attachment */}
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3">
                    <span className="text-xs font-bold text-neutral-700 block">Video Media Attachment</span>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Video Type</label>
                      <select
                        value={videoType}
                        onChange={(e) => setVideoType(e.target.value as 'none' | 'youtube' | 'upload')}
                        className="border border-neutral-300 rounded-lg p-1.5 text-xs bg-white outline-none focus:ring-1 focus:ring-red-600"
                      >
                        <option value="none">No Video</option>
                        <option value="youtube">YouTube Video Link</option>
                        <option value="upload">Device Uploaded Video File</option>
                      </select>
                    </div>

                    {videoType === 'youtube' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-neutral-500">YouTube Video URL</label>
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="border border-neutral-300 rounded-lg p-1.5 text-xs outline-none focus:ring-1 focus:ring-red-600"
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    )}

                    {videoType === 'upload' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-neutral-500">Or Upload MP4 Video File</label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="text-xs"
                        />
                        {uploadingVideo && <span className="text-xs text-red-600 animate-pulse">Uploading Video...</span>}
                        {videoUrl && <p className="text-[10px] text-green-600 truncate">{videoUrl}</p>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-neutral-700 block">Media Display Mode</span>
                    <p className="text-[11px] text-neutral-500">Decide if news cards should prioritize displaying image or video media.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaToDisplay('image')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 border transition-all ${
                        mediaToDisplay === 'image'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <Image className="w-3.5 h-3.5" />
                      Show Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaToDisplay('video')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 border transition-all ${
                        mediaToDisplay === 'video'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      Show Video
                    </button>
                  </div>
                </div>
              </div>

              {/* SPECIAL FLAG CHECKS */}
              <div className="border-t border-neutral-200 pt-4 flex gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-red-600 focus:ring-red-600"
                  />
                  Featured Article
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-red-600 focus:ring-red-600"
                  />
                  Breaking News Ticker
                </label>
              </div>

              <div className="border-t border-neutral-200 pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-semibold hover:bg-neutral-50 text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg"
                >
                  {editingArticle ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER CREATE / EDIT MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">
                {editingUser ? 'Edit Editor Details' : 'Add New Community Editor'}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700">Full Name *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="Enter full name..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700">Email Address *</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="Enter email address..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700">Role</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="border border-neutral-300 rounded-lg p-2 text-sm bg-white outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Contributor">Contributor</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700">Status</label>
                <select
                  value={userStatus}
                  onChange={(e) => setUserStatus(e.target.value)}
                  className="border border-neutral-300 rounded-lg p-2 text-sm bg-white outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="border-t border-neutral-200 pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-semibold hover:bg-neutral-50 text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg"
                >
                  {editingUser ? 'Save Editor' : 'Create Editor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
