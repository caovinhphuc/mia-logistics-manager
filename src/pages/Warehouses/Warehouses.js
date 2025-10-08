import {
    Inventory,
    TrendingDown,
    Warehouse,
    Warning
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Paper,
    Typography
} from '@mui/material';

const StatCard = ({ title, value, icon, color, bgColor }) => (
    <Card
        sx={{
            height: '100%',
            background: `linear-gradient(135deg, ${bgColor} 0%, white 100%)`,
            border: `1px solid ${color}20`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${color}20`
            }
        }}
    >
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ mr: 2 }}>
                {icon}
            </Box>
            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: color,
                        mb: 0.5
                    }}
                >
                    {value}
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 500 }}
                >
                    {title}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

const Warehouses = () => {
    // Mock data - thay thế bằng dữ liệu thực khi có API
    const statsCards = [
        {
            title: 'Tổng kho hàng',
            value: '15',
            icon: <Warehouse sx={{ fontSize: 40, color: '#1976d2' }} />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
        },
        {
            title: 'Sản phẩm trong kho',
            value: '12,450',
            icon: <Inventory sx={{ fontSize: 40, color: '#2e7d32' }} />,
            color: '#2e7d32',
            bgColor: '#e8f5e8'
        },
        {
            title: 'Sắp hết hàng',
            value: '23',
            icon: <TrendingDown sx={{ fontSize: 40, color: '#f57c00' }} />,
            color: '#f57c00',
            bgColor: '#fff3e0'
        },
        {
            title: 'Cần kiểm tra',
            value: '7',
            icon: <Warning sx={{ fontSize: 40, color: '#d32f2f' }} />,
            color: '#d32f2f',
            bgColor: '#ffebee'
        }
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Quản lý kho hàng
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statsCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard {...card} />
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, textAlign: 'center', boxShadow: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    Trang quản lý kho hàng đang được phát triển...
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Tính năng này sẽ bao gồm:
                </Typography>
                <ul style={{ textAlign: 'left', marginTop: '16px' }}>
                    <li>Quản lý tồn kho</li>
                    <li>Nhập xuất hàng hóa</li>
                    <li>Theo dõi vị trí hàng hóa</li>
                    <li>Báo cáo tồn kho</li>
                </ul>
            </Paper>
        </Box>
    );
};

export default Warehouses;
