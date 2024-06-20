const User = {
  username: 'john_doe',
  registrationDate: '2023-01-15',
  mail: "restro222@gmail.com",
  id: '123456789',
  subscriptionType: 'Premium',
  restaurants: [
    {
        name: 'Restaurant 1',
        tables: [
          { id: 1, x: 150, y: 100 },
          { id: 2, x: 250, y: 200 },
          { id: 3, x: 350, y: 300 },
          { id: 4, x: 150, y: 250 },
          { id: 5, x: 250, y: 350 },
          { id: 6, x: 350, y: 450 }
        ],
        techCards: [
          { id: 1, name: 'Tech Card 1', productionOutput: '100', costCalculation: '$500', losses: '10%', components: 'Component 1, Component 2' },
          { id: 2, name: 'Tech Card 2', productionOutput: '150', costCalculation: '$700', losses: '8%', components: 'Component 3, Component 4' },
          { id: 3, name: 'Tech Card 3', productionOutput: '120', costCalculation: '$550', losses: '11%', components: 'Component 5, Component 6' },
          { id: 4, name: 'Tech Card 4', productionOutput: '200', costCalculation: '$900', losses: '12%', components: 'Component 7, Component 8' },
          { id: 5, name: 'Tech Card 5', productionOutput: '180', costCalculation: '$800', losses: '9%', components: 'Component 9, Component 10' },
          { id: 6, name: 'Tech Card 6', productionOutput: '80', costCalculation: '$400', losses: '15%', components: 'Component 11, Component 12' },
          { id: 7, name: 'Tech Card 7', productionOutput: '250', costCalculation: '$1000', losses: '7%', components: 'Component 13, Component 14' },
          { id: 8, name: 'Tech Card 8', productionOutput: '160', costCalculation: '$600', losses: '12%', components: 'Component 15, Component 16' },
          { id: 9, name: 'Tech Card 9', productionOutput: '120', costCalculation: '$550', losses: '11%', components: 'Component 17, Component 18' },
          { id: 10, name: 'Tech Card 10', productionOutput: '200', costCalculation: '$900', losses: '12%', components: 'Component 19, Component 20' },
          { id: 11, name: 'Tech Card 11', productionOutput: '150', costCalculation: '$700', losses: '8%', components: 'Component 21, Component 22' },
          { id: 12, name: 'Tech Card 12', productionOutput: '100', costCalculation: '$500', losses: '10%', components: 'Component 23, Component 24' },
          { id: 13, name: 'Tech Card 13', productionOutput: '80', costCalculation: '$400', losses: '15%', components: 'Component 25, Component 26' },
          { id: 14, name: 'Tech Card 14', productionOutput: '250', costCalculation: '$1000', losses: '7%', components: 'Component 27, Component 28' },
          { id: 15, name: 'Tech Card 15', productionOutput: '160', costCalculation: '$600', losses: '12%', components: 'Component 29, Component 30' },
          { id: 16, name: 'Tech Card 16', productionOutput: '120', costCalculation: '$550', losses: '11%', components: 'Component 31, Component 32' },
          { id: 17, name: 'Tech Card 17', productionOutput: '200', costCalculation: '$900', losses: '12%', components: 'Component 33, Component 34' },
          { id: 18, name: 'Tech Card 18', productionOutput: '150', costCalculation: '$700', losses: '8%', components: 'Component 35, Component 36' },
          { id: 19, name: 'Tech Card 19', productionOutput: '100', costCalculation: '$500', losses: '10%', components: 'Component 37, Component 38' },
          { id: 20, name: 'Tech Card 20', productionOutput: '80', costCalculation: '$400', losses: '15%', components: 'Component 39, Component 40' }
        ]
      },
    {
      name: 'Restaurant 2',
      techCards: [
        { id: 1, name: 'Tech Card 21', productionOutput: '100', costCalculation: '$500', losses: '10%', components: 'Component 41, Component 42' },
        { id: 2, name: 'Tech Card 22', productionOutput: '150', costCalculation: '$700', losses: '8%', components: 'Component 43, Component 44' },
      ]
    },
    {
      name: 'Restaurant 3',
      techCards: [
        { id: 1, name: 'Tech Card 31', productionOutput: '200', costCalculation: '$900', losses: '12%', components: 'Component 61, Component 62' },
        { id: 2, name: 'Tech Card 32', productionOutput: '180', costCalculation: '$800', losses: '9%', components: 'Component 63, Component 64' },
        { id: 3, name: 'Tech Card 33', productionOutput: '80', costCalculation: '$400', losses: '15%', components: 'Component 65, Component 66' },
      ]
    },
    {
      name: 'Restaurant 4',
      techCards: [
        { id: 1, name: 'Tech Card 41', productionOutput: '250', costCalculation: '$1000', losses: '7%', components: 'Component 71, Component 72' },
        { id: 2, name: 'Tech Card 42', productionOutput: '160', costCalculation: '$600', losses: '12%', components: 'Component 73, Component 74' },
        { id: 3, name: 'Tech Card 43', productionOutput: '120', costCalculation: '$550', losses: '11%', components: 'Component 75, Component 76' }
      ]
    }
  ]
};

export default User;
