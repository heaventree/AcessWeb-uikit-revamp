import type { Report } from '../types';

// Simulated database
let reports: Report[] = [];

export const reportService = {
  getAllReports: async (): Promise<Report[]> => {
    return reports;
  },

  getReportById: async (id: string): Promise<Report | null> => {
    return reports.find(report => report.id === id) || null;
  },

  getReportsByClient: async (clientId: string): Promise<Report[]> => {
    return reports.filter(report => report.clientId === clientId);
  },

  createReport: async (data: Omit<Report, 'id' | 'scanDate' | 'status'>): Promise<Report> => {
    const newReport: Report = {
      id: Date.now().toString(),
      ...data,
      scanDate: new Date().toISOString(),
      status: 'in_progress'
    };
    reports.push(newReport);
    return newReport;
  },

  updateReportStatus: async (id: string, status: Report['status']): Promise<Report | null> => {
    const report = reports.find(r => r.id === id);
    if (!report) return null;

    report.status = status;
    return report;
  },

  getReportStats: async (startDate: string, endDate: string): Promise<{
    totalScans: number;
    criticalIssues: number;
    seriousIssues: number;
    moderateIssues: number;
    minorIssues: number;
    averageIssuesPerScan: number;
  }> => {
    const filteredReports = reports.filter(report => 
      report.scanDate >= startDate && report.scanDate <= endDate
    );

    const issueStats = filteredReports.reduce((stats, report) => ({
      criticalIssues: stats.criticalIssues + report.issues.critical,
      seriousIssues: stats.seriousIssues + report.issues.serious,
      moderateIssues: stats.moderateIssues + report.issues.moderate,
      minorIssues: stats.minorIssues + report.issues.minor
    }), {
      criticalIssues: 0,
      seriousIssues: 0,
      moderateIssues: 0,
      minorIssues: 0
    });

    const totalIssues = Object.values(issueStats).reduce((a, b) => a + b, 0);

    return {
      totalScans: filteredReports.length,
      ...issueStats,
      averageIssuesPerScan: filteredReports.length ? totalIssues / filteredReports.length : 0
    };
  }
};