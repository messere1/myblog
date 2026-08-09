import { describe, expect, it } from 'vitest'
import { getProjectCaseStudy } from '@/data/projectCaseStudies'

describe('project case studies', () => {
  it('returns the verified myblog case study without case sensitivity', () => {
    const study = getProjectCaseStudy('MyBlog')

    expect(study?.flow).toEqual([
      'Visitor',
      'EdgeOne Pages',
      'Vue 3 Client',
      'Supabase · GitHub · Giscus',
    ])
    expect(study?.decisions).toHaveLength(4)
  })

  it('does not invent a case study for an unknown repository', () => {
    expect(getProjectCaseStudy('bizenova')).toBeUndefined()
  })
})
