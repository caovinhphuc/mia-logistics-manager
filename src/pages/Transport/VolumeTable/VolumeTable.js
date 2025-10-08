import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import AddIcon from '@mui/icons-material/Add';

const VolumeTable = () => {
  const [calculator, setCalculator] = useState({
    length: '',
    width: '',
    height: '',
    weight: '',
    unit: 'cm'
  });

  // Bảng khối tương đối mẫu
  const volumeRates = [
    { range: '0 - 50kg', rate: 1.0, description: 'Hàng nhẹ thường' },
    { range: '51 - 100kg', rate: 1.2, description: 'Hàng trung bình' },
    { range: '101 - 200kg', rate: 1.5, description: 'Hàng nặng' },
    { range: '201 - 500kg', rate: 1.8, description: 'Hàng rất nặng' },
    { range: '> 500kg', rate: 2.0, description: 'Hàng siêu nặng' }
  ];

  const calculateVolume = () => {
    const { length, width, height, weight, unit } = calculator;
    
    if (!length || !width || !height || !weight) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    let l = parseFloat(length);
    let w = parseFloat(width);
    let h = parseFloat(height);
    let wt = parseFloat(weight);

    // Convert to meters if input is in cm
    if (unit === 'cm') {
      l = l / 100;
      w = w / 100;
      h = h / 100;
    }

    const volume = l * w * h; // m³
    const volumetricWeight = volume * 167; // 1m³ = 167kg standard
    const chargeableWeight = Math.max(wt, volumetricWeight);

    // Find rate based on weight
    let rate = 1.0;
    if (chargeableWeight <= 50) rate = 1.0;
    else if (chargeableWeight <= 100) rate = 1.2;
    else if (chargeableWeight <= 200) rate = 1.5;
    else if (chargeableWeight <= 500) rate = 1.8;
    else rate = 2.0;

    alert(`
Kết quả tính toán:
- Thể tích: ${volume.toFixed(3)} m³
- Trọng lượng thể tích: ${volumetricWeight.toFixed(1)} kg
- Trọng lượng tính cước: ${chargeableWeight.toFixed(1)} kg
- Hệ số khối: ${rate}
    `);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <CalculateIcon sx={{ fontSize: 32, color: '#1976d2', mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
            Bảng khối tương đối
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ px: 3, py: 1.5 }}
        >
          Thêm mức giá
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Calculator */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Máy tính khối tương đối
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Dài"
                    type="number"
                    value={calculator.length}
                    onChange={(e) => setCalculator({...calculator, length: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Rộng"
                    type="number"
                    value={calculator.width}
                    onChange={(e) => setCalculator({...calculator, width: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Cao"
                    type="number"
                    value={calculator.height}
                    onChange={(e) => setCalculator({...calculator, height: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Đơn vị</InputLabel>
                    <Select
                      value={calculator.unit}
                      onChange={(e) => setCalculator({...calculator, unit: e.target.value})}
                      label="Đơn vị"
                    >
                      <MenuItem value="cm">Centimet (cm)</MenuItem>
                      <MenuItem value="m">Mét (m)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Trọng lượng thực (kg)"
                    type="number"
                    value={calculator.weight}
                    onChange={(e) => setCalculator({...calculator, weight: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={calculateVolume}
                    sx={{ py: 1.5 }}
                  >
                    Tính toán
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Hướng dẫn tính toán
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Công thức tính:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Thể tích = Dài × Rộng × Cao (m³)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Trọng lượng thể tích = Thể tích × 167 (kg)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Trọng lượng tính cước = MAX(Trọng lượng thực, Trọng lượng thể tích)
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Lưu ý:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 1 m³ = 167 kg (chuẩn hàng không)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Hệ số khối được áp dụng dựa trên trọng lượng tính cước
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Phí vận chuyển = Trọng lượng tính cước × Đơn giá × Hệ số khối
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Volume Rate Table */}
      <Paper sx={{ mt: 4, boxShadow: 2 }}>
        <Box p={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Bảng hệ số khối tương đối
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phạm vi trọng lượng</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hệ số khối</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mô tả</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {volumeRates.map((rate, index) => (
                  <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{rate.range}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {rate.rate}
                      </Typography>
                    </TableCell>
                    <TableCell>{rate.description}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        Sửa
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default VolumeTable;