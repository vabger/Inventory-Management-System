// app/index.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import { Link } from 'expo-router';
import { MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import authStore from '@/store/Authstore';

const Dashboard = () => {
  const tabs = [
    {
      name: 'Insights of Data',
      route: '/insights',
      icon: <MaterialIcons name="insights" size={28} color="#f39c12" />,
      backgroundColor: '#fce4b3',
    },
    {
      name: 'Manage Employees',
      route: '/employees',
      icon: <FontAwesome5 name="users-cog" size={28} color="#1abc9c" />,
      backgroundColor: '#d1f7f5',
    },
    {
      name: 'Create Inventory Report',
      route: '/reports',
      icon: <Entypo name="text-document" size={28} color="#9b59b6" />,
      backgroundColor: '#f4e3fa',
    },
    {
      name: 'Available Items',
      route: '/items',
      icon: <MaterialIcons name="inventory" size={28} color="#3498db" />,
      backgroundColor: '#d9ecfa',
    },
    {
      name: 'Settings',
      route: '/settings',
      icon: <MaterialIcons name="settings" size={28} color="#e74c3c" />,
      backgroundColor: '#fadbd8',
    },
    {
      name: 'Help',
      route: '/help',
      icon: <Entypo name="help-with-circle" size={28} color="#34495e" />,
      backgroundColor: '#d5d8dc',
    },
  ];

  return (
    <View style={styles.container}>
      <Header style={styles.header} />
      <Text style={styles.title}>Hi, {authStore.username}!</Text>
      <Text style={styles.subtitle}>What would you like to do today?</Text>
      <Text style={styles.title}>Tools</Text>
      <View style={styles.grid}>
        {tabs.map((tab, idx) => (
          <Link key={idx} href={tab.route} style={[styles.tab, { backgroundColor: tab.backgroundColor }]}>
            <View style={styles.iconContainer}>{tab.icon}</View>
            <Text>{"\n"}</Text>
            <Text style={styles.tabText}>{tab.name}</Text>
          </Link>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Light grey background for the dashboard
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e', // Dark grey text
    marginHorizontal: 20,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d', // Soft grey text
    marginHorizontal: 20,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  tab: {
    width: '45%',
    margin: '2.5%',
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 4, // iOS shadow
    flexDirection: 'column', // Stack items vertically
    padding: 10, // Add padding for better spacing
    backgroundColor: '#ffffff', // Ensure a clean background
  },
  iconContainer: {
    marginBottom: 10, // Add space between icon and text
    alignItems: 'center', // Center the icon
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f8f8', // Add a light background for the icon
    elevation: 2, // Android shadow for icons
    shadowColor: '#000', // iOS shadow for icons
    shadowOffset: { width: 0, height: 1 }, // iOS shadow for icons
    shadowOpacity: 0.15, // iOS shadow for icons
    shadowRadius: 2, // iOS shadow for icons
  },
  tab: {
    width: '45%',
    margin: '2.5%',
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 4, // iOS shadow
    flexDirection: 'column', // Stack items vertically
    padding: 10, // Add padding for better spacing
    backgroundColor: '#ffffff', // Ensure a clean background
  },
  iconContainer: {
    marginBottom: 10, // Add space between icon and text
    alignItems: 'center', // Center the icon
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f8f8', // Add a light background for the icon
    elevation: 2, // Android shadow for icons
    shadowColor: '#000', // iOS shadow for icons
    shadowOffset: { width: 0, height: 1 }, // iOS shadow for icons
    shadowOpacity: 0.15, // iOS shadow for icons
    shadowRadius: 2, // iOS shadow for icons
  },
  tabText: {
    color: '#2c3e50', // Dark grey text for tab labels
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },


});

export default Dashboard;
