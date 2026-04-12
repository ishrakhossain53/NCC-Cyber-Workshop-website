'use client'

import { useState, useEffect } from 'react'
import { databaseService, storageService } from '@/lib/appwrite'
import { Instructor } from '@/types'
import { Github, Linkedin, Twitter, Globe, Shield, Terminal, User } from 'lucide-react'

export function InstructorsMatrix() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      const response = await databaseService.getAllInstructors()
      setInstructors(response.documents as unknown as Instructor[])
    } catch (error) {
      console.error('Failed to fetch instructors:', error)
      // No fallback - show empty state instead
      setInstructors([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get instructor image URL
  const getInstructorImageUrl = (instructor: Instructor) => {
    if (!instructor.profile_image) return null
    
    // If it's already a URL, return it
    if (instructor.profile_image.startsWith('http')) {
      return instructor.profile_image
    }
    
    // If it's a file ID, get the preview URL
    try {
      return storageService.getFilePreview(instructor.profile_image).href
    } catch (error) {
      console.error('Failed to get image URL:', error)
      return null
    }
  }

  if (loading) {
    return (
      <section id="instructors" className="py-20 px-4 sm:px-6 lg:px-8 matrix-bg relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold matrix-text mb-4 font-mono">
              [LOADING_MATRIX_<span className="text-green-400 animate-glow">ARCHITECTS</span>]
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="matrix-card p-6 animate-pulse">
                <div className="w-24 h-24 bg-green-500/20 rounded-full mx-auto mb-4 border border-green-500/30"></div>
                <div className="h-4 bg-green-500/20 rounded mb-2"></div>
                <div className="h-3 bg-green-500/20 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-green-500/20 rounded"></div>
                  <div className="h-3 bg-green-500/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="instructors" className="py-20 px-4 sm:px-6 lg:px-8 matrix-bg relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Shield className="h-8 w-8 text-green-400 mr-3 animate-glow" />
            <h2 className="text-3xl md:text-4xl font-bold matrix-text font-mono">
              [MATRIX_<span className="text-green-400 animate-glow">ARCHITECTS</span>]
            </h2>
            <Terminal className="h-8 w-8 text-green-400 ml-3 animate-glow" />
          </div>
          <p className="text-green-200 max-w-3xl mx-auto text-lg font-mono leading-relaxed">
            {'>'}MEET_THE_ELITE_CYBER_GUARDIANS_WHO_WILL_GUIDE_YOU_THROUGH_THE_MATRIX.
            <br />
            {'>'}EACH_ARCHITECT_BRINGS_YEARS_OF_EXPERIENCE_IN_DIGITAL_WARFARE_AND_PROTECTION.
          </p>
        </div>

        {/* Instructors Grid */}
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {instructors.map((instructor, index) => {
            const imageUrl = getInstructorImageUrl(instructor)
            
            return (
              <div
                key={instructor.$id}
                className="matrix-card p-6 hover:animate-glow transition-all duration-300 transform hover:scale-105 button-interactive"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={instructor.name}
                        className="w-full h-full rounded-full object-cover border-2 border-green-500/50 hover:border-green-400 transition-all duration-300"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br from-green-500/20 to-green-400/30 rounded-full flex items-center justify-center border-2 border-green-500/50 relative overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent animate-pulse"></div>
                                <span class="text-2xl font-bold matrix-text font-mono relative z-10">
                                  ${instructor.name.split('_').map(n => n[0]).join('')}
                                </span>
                              </div>
                            `
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-green-400/30 rounded-full flex items-center justify-center border-2 border-green-500/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent animate-pulse"></div>
                        <User className="h-8 w-8 text-green-300" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-green-100 mb-2 font-mono hover:animate-glow transition-all duration-300">
                    [{instructor.name}]
                  </h3>
                  <div className="text-green-300 text-sm font-mono bg-green-500/20 px-3 py-1 rounded-lg border border-green-400/30">
                    [STATUS: MATRIX_ARCHITECT]
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <div className="text-green-200 text-sm mb-3 font-mono leading-relaxed bg-black/20 p-3 rounded-lg border border-green-500/20">
                    {instructor.bio}
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <h4 className="matrix-text font-semibold mb-3 font-mono text-green-300">[EXPERTISE_MATRIX]</h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-green-500/30 text-green-100 border border-green-400/50 rounded-lg text-xs font-medium font-mono hover:animate-glow hover:bg-green-500/40 transition-all duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4 bg-black/20 p-3 rounded-lg border border-green-500/20">
                  {instructor.social_linkedin && (
                    <a
                      href={instructor.social_linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:text-green-100 hover:animate-glow transition-all duration-300 button-interactive hover:scale-110"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {instructor.social_github && (
                    <a
                      href={instructor.social_github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:text-green-100 hover:animate-glow transition-all duration-300 button-interactive hover:scale-110"
                      title="GitHub Profile"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {instructor.social_twitter && (
                    <a
                      href={instructor.social_twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:text-green-100 hover:animate-glow transition-all duration-300 button-interactive hover:scale-110"
                      title="Twitter Profile"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {instructor.social_website && (
                    <a
                      href={instructor.social_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:text-green-100 hover:animate-glow transition-all duration-300 button-interactive hover:scale-110"
                      title="Personal Website"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        ) : (
          <div className="text-center py-16">
            <div className="matrix-card p-8 max-w-md mx-auto">
              <Terminal className="h-16 w-16 text-green-400 mx-auto mb-4 animate-glow" />
              <h3 className="text-xl font-bold matrix-text mb-2 font-mono">
                [MATRIX_ARCHITECTS_LOADING...]
              </h3>
              <p className="text-green-200 font-mono text-sm">
                {'>'}CYBER_GUARDIANS_WILL_BE_REVEALED_SOON.
                <br />
                {'>'}STAY_TUNED_FOR_UPDATES.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="matrix-card p-8 max-w-3xl mx-auto relative overflow-hidden">
            {/* Animated border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold matrix-text mb-4 font-mono">
                [READY_TO_ENTER_THE_MATRIX?]
              </h3>
              <p className="text-green-200 mb-6 font-mono">
                {'>'}JOIN_OUR_CYBER_MATRIX_PROTOCOL_AND_GET_HANDS_ON_TRAINING_FROM_THESE_DIGITAL_ARCHITECTS.
                <br />
                {'>'}LIMITED_ACCESS_SLOTS_AVAILABLE_IN_THE_MATRIX!
              </p>
              <a
                href="/register"
                className="matrix-button px-8 py-4 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 button-interactive font-mono"
              >
                [REGISTER_FOR_MATRIX_ACCESS]
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
