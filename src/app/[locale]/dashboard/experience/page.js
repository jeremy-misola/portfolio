"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  User, 
  Search, 
  Tag, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ExperiencePage() {
  const { toast } = useToast();
  const [experience, setExperience] = useState([]);
  const [filteredExperience, setFilteredExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: [],
    achievements: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [techInput, setTechInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  useEffect(() => {
    fetchExperience();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [experience, searchTerm, sortBy]);

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/experience');
      const data = await response.json();
      setExperience(data);
    } catch (error) {
      console.error('Error fetching experience:', error);
      toast({
        title: "Error",
        description: "Failed to load experience",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...experience];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'position':
          return a.position.localeCompare(b.position);
        default:
          return 0;
      }
    });

    setFilteredExperience(filtered);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.company.trim()) errors.company = 'Company is required';
    if (!formData.position.trim()) errors.position = 'Position is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.technologies.length === 0) errors.technologies = 'At least one technology is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newExperience = await response.json();
        toast({
          title: "Success",
          description: "Experience added successfully",
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchExperience();
      } else {
        toast({
          title: "Error",
          description: "Failed to add experience",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add experience",
        variant: "destructive",
      });
    }
  };

  const handleEditExperience = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/admin/experience', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingExperience.id, ...formData })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Experience updated successfully",
        });
        setIsEditDialogOpen(false);
        setEditingExperience(null);
        resetForm();
        fetchExperience();
      } else {
        toast({
          title: "Error",
          description: "Failed to update experience",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update experience",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/experience', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "Experience has been deleted",
        });
        fetchExperience();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete experience",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (exp) => {
    setEditingExperience(exp);
    setFormData({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description,
      technologies: exp.technologies,
      achievements: exp.achievements
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: [],
      achievements: []
    });
    setFormErrors({});
    setTechInput('');
    setAchievementInput('');
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const addAchievement = () => {
    if (achievementInput.trim() && !formData.achievements.includes(achievementInput.trim())) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, achievementInput.trim()]
      });
      setAchievementInput('');
    }
  };

  const removeAchievement = (achievement) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter(a => a !== achievement)
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    let duration = '';
    if (diffYears > 0) duration += `${diffYears} year${diffYears > 1 ? 's' : ''} `;
    if (diffMonths > 0) duration += `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    
    return duration.trim();
  };

  const getStatusBadge = (exp) => {
    const isCurrent = !exp.endDate;
    return isCurrent ? (
      <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Current</Badge>
    ) : (
      <Badge variant="outline">Past</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experience Management</h1>
          <p className="text-muted-foreground">Manage your work history and professional experience</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Experience</DialogTitle>
              <DialogDescription>
                Add a new work experience to your portfolio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExperience}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={formErrors.company ? "border-red-500" : ""}
                    />
                    {formErrors.company && <p className="text-red-500 text-sm">{formErrors.company}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className={formErrors.position ? "border-red-500" : ""}
                    />
                    {formErrors.position && <p className="text-red-500 text-sm">{formErrors.position}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={formErrors.startDate ? "border-red-500" : ""}
                    />
                    {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate}
                    />
                    <div className="text-xs text-muted-foreground">
                      Leave empty if currently working here
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`min-h-[120px] ${formErrors.description ? "border-red-500" : ""}`}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies Used</Label>
                  <div className="flex gap-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Type a technology and press Enter"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    />
                    <Button type="button" onClick={addTechnology} variant="outline">
                      <Tag className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {formErrors.technologies && <p className="text-red-500 text-sm">{formErrors.technologies}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <div className="flex gap-2">
                    <Input
                      value={achievementInput}
                      onChange={(e) => setAchievementInput(e.target.value)}
                      placeholder="Type an achievement and press Enter"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    />
                    <Button type="button" onClick={addAchievement} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span>{achievement}</span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(achievement)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Experience</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{experience.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Position</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {experience.filter(e => !e.endDate).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(experience.map(e => e.company)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technologies</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(experience.flatMap(e => e.technologies)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search experience..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="date">Sort by Date</option>
                <option value="company">Sort by Company</option>
                <option value="position">Sort by Position</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience List */}
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>
            {filteredExperience.length} experience{filteredExperience.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredExperience.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No experience found
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {filteredExperience.map((exp) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{exp.position}</h3>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{exp.company}</span>
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(exp)}
                        </div>
                        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </span>
                          </div>
                          <span>•</span>
                          <span>{getDuration(exp.startDate, exp.endDate)}</span>
                        </div>
                        <p className="text-muted-foreground mb-3">{exp.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {exp.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary">{tech}</Badge>
                          ))}
                        </div>
                        {exp.achievements.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Key Achievements:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {exp.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(exp)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(exp.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
            <DialogDescription>
              Update the experience information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditExperience}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    name="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={formErrors.company ? "border-red-500" : ""}
                  />
                  {formErrors.company && <p className="text-red-500 text-sm">{formErrors.company}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Input
                    id="edit-position"
                    name="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className={formErrors.position ? "border-red-500" : ""}
                  />
                  {formErrors.position && <p className="text-red-500 text-sm">{formErrors.position}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={formErrors.startDate ? "border-red-500" : ""}
                  />
                  {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate}
                  />
                  <div className="text-xs text-muted-foreground">
                    Leave empty if currently working here
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`min-h-[120px] ${formErrors.description ? "border-red-500" : ""}`}
                />
                {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-technologies">Technologies Used</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Type a technology and press Enter"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology} variant="outline">
                    <Tag className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {formErrors.technologies && <p className="text-red-500 text-sm">{formErrors.technologies}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-achievements">Key Achievements</Label>
                <div className="flex gap-2">
                  <Input
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    placeholder="Type an achievement and press Enter"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                  />
                  <Button type="button" onClick={addAchievement} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>{achievement}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(achievement)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Experience</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}