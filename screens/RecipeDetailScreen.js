import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const RecipeDetailScreen = ({ navigation }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Animaciones
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(1.2)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(50)).current;

  const fetchRandomRecipe = async () => {
    try {
      setLoading(true);
      // Resetear animaciones
      imageOpacity.setValue(0);
      imageScale.setValue(1.2);
      titleOpacity.setValue(0);
      titleTranslateY.setValue(30);
      contentOpacity.setValue(0);
      contentTranslateY.setValue(50);
      
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      
      if (data.meals && data.meals[0]) {
        setRecipe(data.meals[0]);
        startAnimations();
      } else {
        Alert.alert('Error', 'No se encontró la receta');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la receta. Verifica tu conexión a internet.');
      console.error('Error fetching random recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAnimations = () => {
    // Animar imagen
    Animated.parallel([
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animar título después de la imagen
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // Animar contenido después del título
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);
  };

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  const getIngredients = () => {
    if (!recipe) return [];
    
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }
    return ingredients;
  };

  const handleNewRandomRecipe = () => {
    fetchRandomRecipe();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Preparando tu receta sorpresa...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Receta no encontrada</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRandomRecipe}>
          <Text style={styles.retryButtonText}>Intentar de Nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ingredients = getIngredients();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6C63FF" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Animated.Image 
            source={{ uri: recipe.strMealThumb }} 
            style={[
              styles.recipeImage,
              {
                opacity: imageOpacity,
                transform: [{ scale: imageScale }]
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.imageOverlay,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }]
              }
            ]}
          >
            <Text style={styles.recipeName}>{recipe.strMeal}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{recipe.strCategory}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{recipe.strArea}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <Animated.View 
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }]
            }
          ]}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            <View style={styles.ingredientsContainer}>
              {ingredients.map((item, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientBullet} />
                  <Text style={styles.ingredientText}>
                    {item.measure} {item.ingredient}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preparación</Text>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>{recipe.strInstructions}</Text>
            </View>
          </View>

          {recipe.strYoutube && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Video Tutorial</Text>
              <View style={styles.videoContainer}>
                <Text style={styles.videoText}>Ver en YouTube</Text>
                <Text style={styles.videoLink}>{recipe.strYoutube}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.randomButton} onPress={handleNewRandomRecipe}>
            <Text style={styles.randomButtonText}>✨ Otra Receta Sorpresa</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 18,
    color: '#636E72',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    height: 280,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    color: '#2D3436',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
  },
  ingredientsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6C63FF',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 20,
    flex: 1,
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instructionsText: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
    textAlign: 'justify',
  },
  videoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  videoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 8,
  },
  videoLink: {
    fontSize: 14,
    color: '#636E72',
    textDecorationLine: 'underline',
  },
  randomButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  randomButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default RecipeDetailScreen;
