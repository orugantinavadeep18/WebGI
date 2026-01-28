#!/usr/bin/env node

const testRecommendations = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/rentals/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_budget: 5000,
        location: 'hyderabad',
        gender_preference: 'unisex',
        sharing_type: 'all',
        property_type: 'all',
        min_rating: 0,
        min_capacity: 1,
        min_vacancies: 0,
        required_amenities: [],
        limit: 12
      })
    });

    const data = await response.json();
    
    console.log('\n========== RECOMMENDATION API TEST ==========');
    console.log(`✓ Status: ${response.status}`);
    console.log(`✓ Found: ${data.count} recommendations`);
    console.log(`✓ Total Available: ${data.total_available}`);
    console.log('\n📋 Recommendations:');
    
    if (data.recommendations && data.recommendations.length > 0) {
      data.recommendations.forEach((rental, i) => {
        console.log(`${i + 1}. ${rental.title}`);
        console.log(`   Price: ₹${rental.price}`);
        console.log(`   Type: ${rental.property_type}`);
        console.log(`   Score: ${rental.recommendation_score}/100`);
        console.log(`   Rating: ${rental.rating} ⭐`);
        console.log(`   Capacity: ${rental.capacity}, Vacancies: ${rental.vacancies}`);
        console.log('');
      });
    } else {
      console.log('❌ No recommendations returned');
    }
    
    console.log('========== TEST COMPLETE ==========\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testRecommendations();
