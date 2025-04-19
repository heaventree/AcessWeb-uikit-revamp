import type { Article, TestResult, AccessibilityIssue } from '../types';

class LocalStorageService {
  private getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Articles
  getArticles(): Article[] {
    return this.getItem<Article[]>('articles') || [];
  }

  saveArticle(article: Article): void {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index >= 0) {
      articles[index] = article;
    } else {
      articles.push(article);
    }
    this.setItem('articles', articles);
  }

  // Test Results
  saveTestResult(result: TestResult): void {
    const results = this.getTestResults();
    results.unshift(result);
    // Keep last 100 results
    if (results.length > 100) {
      results.pop();
    }
    this.setItem('test_results', results);
  }

  getTestResults(): TestResult[] {
    return this.getItem<TestResult[]>('test_results') || [];
  }

  // Issues
  saveIssues(url: string, issues: AccessibilityIssue[]): void {
    const issuesMap = this.getItem<Record<string, AccessibilityIssue[]>>('issues') || {};
    issuesMap[url] = issues;
    this.setItem('issues', issuesMap);
  }

  getIssues(url: string): AccessibilityIssue[] {
    const issuesMap = this.getItem<Record<string, AccessibilityIssue[]>>('issues') || {};
    return issuesMap[url] || [];
  }

  // User Settings
  saveUserSettings(settings: any): void {
    this.setItem('user_settings', settings);
  }

  getUserSettings(): any {
    return this.getItem('user_settings') || {};
  }

  // Clear all data
  clearAll(): void {
    localStorage.clear();
  }
}

export const localStorageService = new LocalStorageService();