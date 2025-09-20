import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MenuScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animaciones
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;

  const fetchRecipes = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=a');
      const data = await response.json();
      
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        Alert.alert('Error', 'No se encontraron recetas');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las recetas. Verifica tu conexión a internet.');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Animación del header
  const animateHeader = () => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    fetchRecipes();
    animateHeader();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes();
  };

  const navigateToRandomRecipe = () => {
    navigation.navigate('RecipeDetail');
  };

  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  
  const AnimatedRecipeCard = ({ item, index }) => {
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(0.8)).current;
    const imageOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const delay = index * 150; // Animación escalonada
      
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();

        // Animar imagen después de la tarjeta
        setTimeout(() => {
          Animated.timing(imageOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, 200);

        // Animar texto después de la imagen
        setTimeout(() => {
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, 400);
      }, delay);
    }, []);

    return (
      <Animated.View
        style={[
          styles.recipeCard,
          { 
            backgroundColor: colors[index % colors.length],
            opacity: cardOpacity,
            transform: [{ scale: cardScale }]
          }
        ]}
      >
        <TouchableOpacity onPress={navigateToRandomRecipe} style={styles.cardTouchable}>
          <Animated.Image 
            source={{ uri: item.strMealThumb }} 
            style={[styles.recipeImage, { opacity: imageOpacity }]} 
          />
          <Animated.View style={[styles.recipeInfo, { opacity: textOpacity }]}>
            <Text style={styles.recipeName}>{item.strMeal}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.recipeCategory}>{item.strCategory}</Text>
              <Text style={styles.recipeArea}>{item.strArea}</Text>
            </View>
            <Text style={styles.tapHint}>Toca para receta sorpresa ✨</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderRecipeItem = ({ item, index }) => (
    <AnimatedRecipeCard item={item} index={index} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Cargando recetas deliciosas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6C63FF" barStyle="light-content" />
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }]
          }
        ]}
      >
        <Text style={styles.headerTitle}>Explora Recetas</Text>
        <Text style={styles.headerSubtitle}>Toca cualquier receta para una sorpresa culinaria</Text>
      </Animated.View>
      
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6C63FF']} />
        }
      />
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
  header: {
    padding: 20,
    paddingTop: 15,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '400',
  },
  listContainer: {
    padding: 15,
    paddingTop: 5,
  },
  recipeCard: {
    flex: 1,
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    minHeight: 200,
  },
  cardTouchable: {
    flex: 1,
  },
  recipeImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  recipeInfo: {
    padding: 12,
    flex: 1,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 18,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipeCategory: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  recipeArea: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tapHint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default MenuScreen;
