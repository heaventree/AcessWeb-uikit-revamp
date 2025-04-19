import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, FileText, Plus, Trash2 } from 'lucide-react';
import slugify from 'slugify';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastModified: string;
}

const initialPages: Page[] = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about-us',
    content: '<h1>About Us</h1><p>We are committed to making the web accessible to everyone.</p>',
    lastModified: '2024-03-15'
  },
  {
    id: '2',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: '<h1>Privacy Policy</h1><p>Your privacy is important to us.</p>',
    lastModified: '2024-03-14'
  }
];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'color', 'background',
  'link', 'image'
];

export function AdminCMS() {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const quillRef = useRef<ReactQuill>(null);

  const handleNewPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: 'New Page',
      slug: 'new-page',
      content: '',
      lastModified: new Date().toISOString().split('T')[0]
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage);
    setEditedContent(newPage.content);
    setEditedTitle(newPage.title);
  };

  const handleSave = () => {
    if (!selectedPage) return;

    const updatedPages = pages.map(page => {
      if (page.id === selectedPage.id) {
        return {
          ...page,
          title: editedTitle,
          slug: slugify(editedTitle, { lower: true }),
          content: editedContent,
          lastModified: new Date().toISOString().split('T')[0]
        };
      }
      return page;
    });

    setPages(updatedPages);
  };

  const handleDelete = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(page => page.id !== pageId));
      if (selectedPage?.id === pageId) {
        setSelectedPage(null);
        setEditedContent('');
        setEditedTitle('');
      }
    }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
        <button
          onClick={handleNewPage}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Page
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* Pages List */}
        <div className="col-span-3 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pages</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {pages.map(page => (
              <div
                key={page.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedPage?.id === page.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  setSelectedPage(page);
                  setEditedContent(page.content);
                  setEditedTitle(page.title);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{page.title}</p>
                      <p className="text-xs text-gray-500">/{page.slug}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(page.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-9 bg-white rounded-lg shadow-sm overflow-hidden">
          {selectedPage ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-lg font-medium text-gray-900 border-0 focus:ring-0 p-0"
                  placeholder="Page Title"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Last modified: {selectedPage.lastModified}
                </p>
              </div>
              <div className="flex-grow p-4">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={editedContent}
                  onChange={setEditedContent}
                  modules={modules}
                  formats={formats}
                  className="h-[calc(100%-80px)]"
                />
              </div>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a page to edit or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
}