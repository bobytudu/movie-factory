import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Spin, Alert, List, Tooltip, message, Tag, Tabs } from 'antd';
import { SearchOutlined, CopyOutlined, PlayCircleOutlined, LinkOutlined, CodeOutlined, PlaySquareOutlined, DesktopOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ScrapedIframe {
  src: string;
  id: string;
  name: string;
  width: string;
  height: string;
  outerHTML: string;
}

const ScrapperPage: React.FC = () => {
  const [url, setUrl] = useState('https://netmirror.global/movie/111665/?embed=1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [iframes, setIframes] = useState<ScrapedIframe[]>([]);
  const [selectedIframeSrc, setSelectedIframeSrc] = useState<string | null>(null);
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('iframes');

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setTitle(null);
    setIframes([]);
    setSelectedIframeSrc(null);
    setRawHtml(null);

    try {
      // Call our custom CORS proxy server endpoint (which launches a headless browser to render content)
      const response = await axios.get(`/api/proxy?url=${encodeURIComponent(url)}`);
      const htmlText = response.data;
      setRawHtml(htmlText);

      // Parse HTML document using browser DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      // Get page title
      setTitle(doc.title || 'No title found');

      // Find all iframe elements
      const iframeElements = doc.querySelectorAll('iframe');
      const foundIframes: ScrapedIframe[] = [];

      iframeElements.forEach((iframe) => {
        const src = iframe.getAttribute('src') || '';
        if (src) {
          // Resolve relative URLs relative to target scraping URL
          let resolvedSrc = src;
          if (src.startsWith('//')) {
            resolvedSrc = 'https:' + src;
          } else if (src.startsWith('/')) {
            try {
              const origin = new URL(url).origin;
              resolvedSrc = origin + src;
            } catch (e) {
              console.error('Failed to resolve origin URL:', e);
            }
          }
          
          foundIframes.push({
            src: resolvedSrc,
            id: iframe.getAttribute('id') || 'N/A',
            name: iframe.getAttribute('name') || 'N/A',
            width: iframe.getAttribute('width') || 'N/A',
            height: iframe.getAttribute('height') || 'N/A',
            outerHTML: iframe.outerHTML,
          });
        }
      });

      setIframes(foundIframes);
      if (foundIframes.length > 0) {
        setSelectedIframeSrc(foundIframes[0].src);
        message.success(`Successfully found ${foundIframes.length} iframe(s)!`);
      } else {
        message.warning('No iframe elements found in the document.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to scrape the web page.');
    } finally {
      setLoading(false);
    }
  };

  // Perform initial scrape on page load
  useEffect(() => {
    handleScrape();
  }, []);

  const handleCopy = (src: string) => {
    navigator.clipboard.writeText(src);
    message.success('Iframe URL copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Web{' '}
          <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Scrapper View
          </span>
        </h1>
        <p className="text-slate-400 text-sm">
          Scrape target HTML pages to find embedded video players and `&lt;iframe&gt;` links. Bypasses CORS using Vite dev proxy.
        </p>
      </div>

      {/* URL Input Bar */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 sm:p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            size="large"
            placeholder="Enter target URL to scrape..."
            prefix={<LinkOutlined className="text-slate-500 mr-1" />}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow bg-slate-950/40 hover:bg-slate-950 border-slate-800 text-white rounded-xl h-12"
            onPressEnter={handleScrape}
          />
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleScrape}
            loading={loading}
            className="bg-indigo-600 hover:bg-indigo-500 border-none rounded-xl h-12 px-6 font-bold"
          >
            Scrape URL
          </Button>
        </div>
      </div>

      {/* Main Results View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spin size="large" />
          <span className="text-slate-400 font-medium text-sm animate-pulse">Scraping document...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Main Column: Scraping Info and List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {error && (
              <Alert
                message="Scraping Error"
                description={error}
                type="error"
                showIcon
                closable
                className="bg-red-950/20 border-red-900/50 text-red-300 rounded-xl"
              />
            )}

            {title && (
              <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl text-white">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                  Scraped Document Title
                </h3>
                <p className="text-lg font-bold text-slate-100 mb-0">{title}</p>
              </Card>
            )}

            {/* Tabs container */}
            <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl text-white flex-grow">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                  {
                    key: 'iframes',
                    label: (
                      <span className="text-slate-200 hover:text-white font-bold flex items-center gap-1.5 py-1">
                        <PlaySquareOutlined /> Extracted Iframes ({iframes.length})
                      </span>
                    ),
                    children: (
                      <div className="pt-2">
                        {iframes.length > 0 ? (
                          <List
                            dataSource={iframes}
                            renderItem={(item, index) => (
                              <List.Item
                                key={index}
                                className="border-b border-slate-850 py-4 flex flex-col items-start gap-3 w-full"
                              >
                                <div className="flex w-full items-center justify-between gap-4">
                                  <div className="font-mono text-xs text-slate-400 flex flex-wrap gap-2">
                                    <Tag color="blue" className="m-0">#Iframe {index + 1}</Tag>
                                    {item.id !== 'N/A' && <Tag color="purple">id: {item.id}</Tag>}
                                    <Tag color="default">size: {item.width}x{item.height}</Tag>
                                  </div>
                                  <div className="flex gap-2">
                                    <Tooltip title="Copy URL">
                                      <Button
                                        type="text"
                                        icon={<CopyOutlined />}
                                        onClick={() => handleCopy(item.src)}
                                        className="text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                                      />
                                    </Tooltip>
                                    <Tooltip title="Preview Content">
                                      <Button
                                        type="primary"
                                        icon={<PlayCircleOutlined />}
                                        onClick={() => setSelectedIframeSrc(item.src)}
                                        className={`bg-indigo-650 hover:bg-indigo-500 border-none ${
                                          selectedIframeSrc === item.src ? 'ring-2 ring-indigo-400' : ''
                                        }`}
                                      />
                                    </Tooltip>
                                  </div>
                                </div>

                                <div className="w-full bg-slate-950/60 p-3 rounded-lg border border-slate-900 overflow-x-auto">
                                  <div className="text-emerald-400 font-mono text-sm break-all font-semibold select-all">
                                    {item.src}
                                  </div>
                                </div>
                              </List.Item>
                            )}
                          />
                        ) : (
                          <div className="py-12 text-center text-slate-500">
                            Enter a URL containing iframe/video players to inspect results.
                          </div>
                        )}
                      </div>
                    )
                  },
                  {
                    key: 'raw',
                    label: (
                      <span className="text-slate-200 hover:text-white font-bold flex items-center gap-1.5 py-1">
                        <DesktopOutlined /> Visual Webpage Preview
                      </span>
                    ),
                    children: (
                      <div className="pt-2">
                        {rawHtml ? (
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center bg-slate-900/60 p-3 border border-slate-850 rounded-xl">
                              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                Rendered HTML Document Frame
                              </span>
                              <Button
                                type="text"
                                size="small"
                                icon={<CodeOutlined />}
                                onClick={() => handleCopy(rawHtml)}
                                className="text-indigo-400 hover:text-indigo-300 font-medium"
                              >
                                Copy Source HTML
                              </Button>
                            </div>
                            <div className="w-full h-[60vh] rounded-xl overflow-hidden border border-slate-850 bg-white shadow-inner">
                              <iframe
                                srcDoc={rawHtml}
                                title="Visual Scraper Response Preview"
                                className="w-full h-full border-none"
                                sandbox="allow-scripts"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 text-center text-slate-500">
                            No response page rendered yet. Submit a URL to inspect.
                          </div>
                        )}
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          </div>

          {/* Right Column: Live Iframe Viewport Preview */}
          <div className="lg:col-span-1">
            <Card
              title={<span className="text-white font-bold">Interactive Player Preview</span>}
              className="bg-slate-900/40 border-slate-800/80 rounded-2xl text-white sticky top-24"
            >
              {selectedIframeSrc ? (
                <div className="flex flex-col gap-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <iframe
                      src={selectedIframeSrc}
                      title="Iframe Preview"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                      className="w-full h-full border-none"
                    />
                  </div>
                  <div className="text-xs text-slate-400">
                    <p className="mb-2 font-semibold text-slate-300">Active Source:</p>
                    <span className="font-mono break-all text-indigo-300 bg-indigo-950/20 p-2 rounded block border border-indigo-900/30">
                      {selectedIframeSrc}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-slate-500 text-sm">
                  Select an iframe from the left list to load the preview player viewport.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapperPage;
