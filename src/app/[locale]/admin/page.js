"use client";

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Users,
  FolderKanban,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const locale = useLocale();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    testimonials: { total: 0, approved: 0, pending: 0 },
    projects: { total: 0, completed: 0, inProgress: 0 },
    experience: { total: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, [locale]);

  const ensureArray = (value) => (Array.isArray(value) ? value : []);

  const fetchStats = async () => {
    try {
      const [testimonialsRes, projectsRes, experienceRes] = await Promise.all([
        fetch('/api/admin/testimonials'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/experience')
      ]);

      const testimonials = ensureArray(await testimonialsRes.json());
      const projects = ensureArray(await projectsRes.json());
      const experience = ensureArray(await experienceRes.json());

      setStats({
        testimonials: {
          total: testimonials.length,
          approved: testimonials.filter(t => t.status === 'approved').length,
          pending: testimonials.filter(t => t.status === 'pending').length
        },
        projects: {
          total: projects.length,
          completed: projects.filter(p => p.status === 'completed').length,
          inProgress: projects.filter(p => p.status === 'in-progress').length
        },
        experience: {
          total: experience.length
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const testimonials = ensureArray(await fetch('/api/admin/testimonials').then(res => res.json()));
      const projects = ensureArray(await fetch('/api/admin/projects').then(res => res.json()));
      const experience = ensureArray(await fetch('/api/admin/experience').then(res => res.json()));

      const activities = [
        ...testimonials.map(t => ({
          id: t.id,
          type: 'testimonial',
          title: `${t.name} submitted a testimonial`,
          status: t.status,
          time: new Date(t.createdAt),
          icon: Users
        })),
        ...projects.map(p => ({
          id: p.id,
          type: 'project',
          title: `New project: ${p.title}`,
          status: p.status,
          time: new Date(p.createdAt),
          icon: FolderKanban
        })),
        ...experience.map(e => ({
          id: e.id,
          type: 'experience',
          title: `New experience: ${e.position} at ${e.company}`,
          status: 'added',
          time: new Date(e.createdAt),
          icon: Briefcase
        }))
      ].sort((a, b) => b.time - a.time).slice(0, 5);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const statCards = [
    {
      title: "Testimonials",
      subtitle: "Client feedback management",
      value: stats.testimonials.total,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      actions: [
        { label: "View All", href: `/${locale}/admin/testimonials`, icon: Eye },
        { label: "Add New", href: `/${locale}/admin/testimonials/new`, icon: Plus }
      ],
      badges: [
        { label: "Approved", count: stats.testimonials.approved, variant: "default" },
        { label: "Pending", count: stats.testimonials.pending, variant: "secondary" }
      ]
    },
    {
      title: "Projects",
      subtitle: "Portfolio project management",
      value: stats.projects.total,
      icon: FolderKanban,
      color: "from-green-500 to-emerald-500",
      actions: [
        { label: "View All", href: `/${locale}/admin/projects`, icon: Eye },
        { label: "Add New", href: `/${locale}/admin/projects/new`, icon: Plus }
      ],
      badges: [
        { label: "Completed", count: stats.projects.completed, variant: "default" },
        { label: "In Progress", count: stats.projects.inProgress, variant: "secondary" }
      ]
    },
    {
      title: "Experience",
      subtitle: "Work history management",
      value: stats.experience.total,
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
      actions: [
        { label: "View All", href: `/${locale}/admin/experience`, icon: Eye },
        { label: "Add New", href: `/${locale}/admin/experience/new`, icon: Plus }
      ],
      badges: []
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="glass-panel chrome-stroke micro-reveal rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="section-kicker">Control Center</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
            <span className="kinetic-heading">Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Overview of your portfolio content and recent activity</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchStats} variant="outline" className="tap-scale">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Stats
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bento-grid">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={index === 0 ? "md:col-span-2 lg:col-span-2" : "md:col-span-3 lg:col-span-2"}
          >
            <Card className="h-full interactive-panel">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-md`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{stat.title}</CardTitle>
                      <CardDescription>{stat.subtitle}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">Total Items</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {stat.badges.map((badge, idx) => (
                    <Badge key={idx} variant={badge.variant}>
                      {badge.label}: {badge.count}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 flex-wrap">
                  {stat.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = action.href}
                      className="flex items-center gap-2 tap-scale"
                    >
                      <action.icon className="h-4 w-4" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bento-grid">
        <Card className="md:col-span-4 interactive-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest changes and additions to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3.5 border border-border/60 rounded-xl bg-background/40 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted/70 rounded-lg">
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time.toLocaleDateString()} • {activity.time.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(activity.status)}
                      <Badge variant="outline" className="capitalize">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2 interactive-panel">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might need to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start tap-scale" onClick={() => window.location.href = `/${locale}/admin/testimonials`}>
                <Users className="h-4 w-4 mr-2" />
                Review Pending Testimonials ({stats.testimonials.pending})
              </Button>
              <Button variant="outline" className="justify-start tap-scale" onClick={() => window.location.href = `/${locale}/admin/projects`}>
                <FolderKanban className="h-4 w-4 mr-2" />
                Manage Projects
              </Button>
              <Button variant="outline" className="justify-start tap-scale" onClick={() => window.location.href = `/${locale}/admin/experience`}>
                <Briefcase className="h-4 w-4 mr-2" />
                Update Experience
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Tip: Always review pending testimonials before publishing them to ensure quality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
