import axios from 'axios'
import { goto } from '$app/navigation'

class StoryGenerator {
	jobId: string | null = $state(null)
	jobStatus: string | null = $state(null)
	error: string | null = $state(null)
	loading = $state(false)
	theme = $state('')
	API_BASE_URL = 'http://localhost:8000/api/v1'

	constructor(theme: string) {
		// this.API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
		this.theme = $state(theme)
	}

	async pollJobStatus(id: string) {
		this.loading = true
		this.error = null
		try {
			const response = await axios.get(`${this.API_BASE_URL}/jobs/${id}`)
			const { status, story_id, error: jobError } = response.data
			this.jobStatus = status

			if (status === 'processing') {
				setTimeout(() => this.pollJobStatus(id), 5000)
			}
			if (status === 'completed' && story_id) {
				this.fetchStory(story_id)
				this.loading = false
			}
			if (status === 'failed' || jobError) {
				this.error = jobError || 'Story generation failed. Please try again.'
				this.loading = false
			}
		} catch (e) {
			this.loading = false
			this.error = `Failed to load status: ${typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e)}`
		}
	}

	async generateStory(theme: string) {
		this.loading = true
		this.error = null
		try {
			const response = await axios.post(`${this.API_BASE_URL}/stories/create`, { theme })
			const { job_id, status } = response.data
			this.jobId = job_id
			this.jobStatus = status
			this.pollJobStatus(job_id)
		} catch (e) {
			this.loading = false
			this.error = `Failed to generate story: ${typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e)}`
		}
	}

	async fetchStory(id: string) {
		try {
			this.loading = false
			this.jobStatus = 'completed'
			goto(`/story/${id}`)
		} catch (e) {
			this.error = `Failed to load story: ${typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e)}`
			this.loading = false
		}
	}

	reset() {
		this.jobId = null
		this.jobStatus = null
		this.error = null
		this.theme = ''
		this.loading = false
	}
}

export default StoryGenerator
