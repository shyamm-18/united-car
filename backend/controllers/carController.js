const Car = require('../models/Car');
const Booking = require('../models/Booking');

// @desc    Fetch all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const { brand, type, minPrice, maxPrice } = req.query;
    
    let query = {};
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (type) query.type = { $regex: type, $options: 'i' };
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const car = new Car({
      brand: 'New Brand',
      model: 'New Model',
      type: 'Economy',
      pricePerDay: 0,
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop',
      seats: 5,
      transmission: 'Manual',
      fuel: 'Petrol',
      rating: 0,
      isAvailable: true,
      description: 'New car description',
      gallery: [],
      images360: []
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const { brand, model, type, pricePerDay, image, seats, transmission, fuel, description, isAvailable, gallery, images360 } = req.body;
    const car = await Car.findById(req.params.id);

    if (car) {
      car.brand = brand || car.brand;
      car.model = model || car.model;
      car.type = type || car.type;
      car.pricePerDay = pricePerDay || car.pricePerDay;
      car.image = image || car.image;
      car.seats = seats || car.seats;
      car.transmission = transmission || car.transmission;
      car.fuel = fuel || car.fuel;
      car.description = description || car.description;
      car.isAvailable = isAvailable !== undefined ? isAvailable : car.isAvailable;
      car.gallery = gallery || car.gallery;
      car.images360 = images360 || car.images360;

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      await car.deleteOne();
      res.json({ message: 'Car removed' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended cars for a user
// @route   GET /api/cars/recommendations
// @access  Private/Public
const getRecommendations = async (req, res) => {
  try {
    let recommendations = [];
    
    if (req.user) {
      // 1. AI Logic: Check user's previous bookings
      const userBookings = await Booking.find({ user: req.user._id }).populate('car');
      if (userBookings.length > 0) {
        // Preferred types from history
        const preferredTypes = [...new Set(userBookings.map(b => b.car.type))];
        recommendations = await Car.find({ 
          type: { $in: preferredTypes },
          _id: { $nin: userBookings.map(b => b.car._id) } // Exclude already booked
        }).limit(6);
      }
    }

    // 2. Fallback: High-rated cars or random premium cars
    if (recommendations.length < 3) {
      const fallback = await Car.find({ 
        _id: { $nin: recommendations.map(c => c._id) }
      }).sort({ averageRating: -1 }).limit(6 - recommendations.length);
      recommendations = [...recommendations, ...fallback];
    }

    // 3. Add AI "Reasons" (Mock Insight)
    const insightOptions = [
      "AI Pick: Matches your premium driving style.",
      "Smart Choice: Excellent fuel efficiency for long trips.",
      "Most Popular: High customer satisfaction in your area.",
      "AI Suggestion: Perfect for luxury weekend getaways."
    ];

    const results = recommendations.map(car => ({
      ...car._doc,
      aiInsight: insightOptions[Math.floor(Math.random() * insightOptions.length)]
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated cars for showcase
// @route   GET /api/cars/top
// @access  Public
const getTopRatedCars = async (req, res) => {
  try {
    const cars = await Car.find({ averageRating: { $gte: 4.5 } })
      .sort({ averageRating: -1 })
      .limit(6);
      
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, getRecommendations, getTopRatedCars };
