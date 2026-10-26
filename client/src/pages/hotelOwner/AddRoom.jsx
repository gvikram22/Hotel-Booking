
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'

const initialAmenities = {
  'Free Wifi': false,
  'Free Breakfast': false,
  'Room Service': false,
  'Mountain View': false,
  'Pool Access': false
}

const AddRoom = () => {
  const navigate = useNavigate()

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  })

  const [Inputs, setInputs] = useState({
    roomType: 'Single Bed',
    pricePerNight: '',
    amenities: { ...initialAmenities }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hotelName, setHotelName] = useState('')

  // Load the owner's hotel name from the backend.
  useEffect(() => {
    const fetchHotelName = async () => {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken')

      if (!token) return

      try {
        const baseURL =
          import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

        const response = await fetch(`${baseURL}/api/rooms/owner`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setHotelName(data.hotelName || '')
        }
      } catch (err) {
        console.error('Failed to fetch hotel name:', err)
      }
    }

    fetchHotelName()
  }, [])

  const handleImageChange = (event, number) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      event.target.value = ''
      return
    }

    // Limit each image to 700 KB.
    if (file.size > 700 * 1024) {
      setError('Each image must be 700 KB or smaller.')
      event.target.value = ''
      return
    }

    setError('')
    setImages((previous) => ({
      ...previous,
      [number]: file
    }))
  }

  const handleAmenityChange = (amenity) => {
    setInputs((previous) => ({
      ...previous,
      amenities: {
        ...previous.amenities,
        [amenity]: !previous.amenities[amenity]
      }
    }))
  }

  // Convert an image file into a Base64 data URL.
  const convertImageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read image'))

      reader.readAsDataURL(file)
    })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken')

    if (!token) {
      setError('Login token is missing. Please log in again.')
      navigate('/login')
      return
    }

    let user

    try {
      user = JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      user = null
    }

    if (!user || user.role !== 'hotelOwner') {
      setError('Please log in with your hotel owner account.')
      return
    }

    if (!Inputs.roomType.trim()) {
      setError('Please select a room type.')
      return
    }

    if (
      Inputs.pricePerNight === '' ||
      !Number.isFinite(Number(Inputs.pricePerNight)) ||
      Number(Inputs.pricePerNight) <= 0
    ) {
      setError('Please enter a valid room price.')
      return
    }

    setLoading(true)

    try {
      // Convert only selected images.
      const selectedFiles = [1, 2, 3, 4]
        .map((number) => images[number])
        .filter(Boolean)

      const imageData = await Promise.all(
        selectedFiles.map(convertImageToBase64)
      )

      const amenities = Object.keys(Inputs.amenities).filter(
        (amenity) => Inputs.amenities[amenity]
      )

      const baseURL =
        import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseURL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          roomType: Inputs.roomType.trim(),
          pricePerNight: Number(Inputs.pricePerNight),
          amenities,
          images: imageData
        })
      })

      const data = await response.json()

      if (!response.ok || data.success === false) {
        if (response.status === 401 || response.status === 403) {
          setError(
            data.message ||
              'Session expired or your account is not authorized. Please log in again.'
          )
        } else {
          setError(data.message || 'Failed to add room.')
        }
        return
      }

      setHotelName(data.hotelName || hotelName)
      setSuccess(data.message || 'Room added successfully!')

      setInputs({
        roomType: 'Single Bed',
        pricePerNight: '',
        amenities: { ...initialAmenities }
      })

      setImages({
        1: null,
        2: null,
        3: null,
        4: null
      })

      // Clear the image file inputs so they can be selected again.
      document.querySelectorAll('input[data-room-image]').forEach((input) => {
        input.value = ''
      })
    } catch (err) {
      console.error('Add room error:', err)
      setError(
        'Could not add the room. Check that the backend is running and your images are valid.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 py-5 md:px-8">
      <Title
        title="Add Room"
        subTitle="Fill in the details to add a new room."
      />

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl">
        {hotelName && (
          <p className="mb-5 text-sm text-gray-700">
            Hotel: <strong>{hotelName}</strong>
          </p>
        )}

        <p className="mb-3 font-medium text-gray-700">Room Images</p>

        <div className="mb-4 flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((number) => (
            <label
              key={number}
              className="flex h-28 w-36 cursor-pointer items-center justify-center overflow-hidden rounded border border-gray-200 bg-indigo-50"
            >
              {images[number] ? (
                <img
                  src={URL.createObjectURL(images[number])}
                  alt={`Room ${number}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-blue-600">+ Upload</span>
              )}

              <input
                data-room-image
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(event) => handleImageChange(event, number)}
              />
            </label>
          ))}
        </div>

        <p className="mb-8 text-xs text-gray-500">
          Select up to 4 images. Each image must be 700 KB or smaller.
          Images are stored directly in MongoDB.
        </p>

        <div className="mb-6 flex flex-wrap gap-5">
          <div>
            <label
              htmlFor="roomType"
              className="mb-2 block font-medium text-gray-700"
            >
              Room Type
            </label>

            <select
              id="roomType"
              value={Inputs.roomType}
              onChange={(event) =>
                setInputs((previous) => ({
                  ...previous,
                  roomType: event.target.value
                }))
              }
              className="w-56 rounded border border-gray-300 bg-white px-3 py-3"
              required
            >
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Luxury Room">Luxury Room</option>
              <option value="Family Suite">Family Suite</option>
              <option value="Deluxe Room">Deluxe Room</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block font-medium text-gray-700"
            >
              Price /night (₹)
            </label>

            <input
              id="price"
              type="number"
              min="1"
              step="0.01"
              value={Inputs.pricePerNight}
              onChange={(event) =>
                setInputs((previous) => ({
                  ...previous,
                  pricePerNight: event.target.value
                }))
              }
              className="w-36 rounded border border-gray-300 px-3 py-3"
              required
            />
          </div>
        </div>

        <p className="mb-3 font-medium text-gray-700">Amenities</p>

        <div className="mb-7 flex flex-col gap-2">
          {Object.keys(Inputs.amenities).map((amenity) => (
            <label
              key={amenity}
              className="flex cursor-pointer items-center gap-2 text-gray-700"
            >
              <input
                type="checkbox"
                checked={Inputs.amenities[amenity]}
                onChange={() => handleAmenityChange(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-700">
            <p>{success}</p>

            {hotelName && (
              <p>Saved under: {hotelName}</p>
            )}

            <button
              type="button"
              onClick={() => navigate('/owner/list-rooms')}
              className="mt-2 text-blue-600 underline"
            >
              View rooms
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-10 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Adding Room...' : 'Add Room'}
        </button>
      </form>
    </div>
  )
}

export default AddRoom
