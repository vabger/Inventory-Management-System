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
      name: 'Manage Employees',
      route: '/employees',
      icon: <FontAwesome5 name="users-cog" size={28} color="#1abc9c" />,
      backgroundColor: '#d1f7f5',
    },
    {
      name: 'Manage Items',
      route: '/items',
      icon: <MaterialIcons name="inventory" size={28} color="#3498db" />,
      backgroundColor: '#d9ecfa',
    },
    {
      name: 'Shipments',
      route: '/shipments',
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
      <Text style={styles.title}>Hi,{authStore.username}!</Text>
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
    backgroundColor: '#f8f8f8',

  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
    marginHorizontal: 20,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
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
    paddingStart: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});

export default Dashboard;
