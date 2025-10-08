import {
    People,
    PersonAdd,
    Star,
    TrendingUp
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

const Customers = () => {
    // Mock data - thay thế bằng dữ liệu thực khi có API
    const statsCards = [
        {
            title: 'Tổng khách hàng',
            value: '2,847',
            icon: <People sx={{ fontSize: 40, color: '#1976d2' }} />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
        },
        {
            title: 'Khách hàng mới',
            value: '127',
            icon: <PersonAdd sx={{ fontSize: 40, color: '#2e7d32' }} />,
            color: '#2e7d32',
            bgColor: '#e8f5e8'
        },
        {
            title: 'Đang hoạt động',
            value: '2,341',
            icon: <TrendingUp sx={{ fontSize: 40, color: '#f57c00' }} />,
            color: '#f57c00',
            bgColor: '#fff3e0'
        },
        {
            title: 'VIP/Premium',
            value: '89',
            icon: <Star sx={{ fontSize: 40, color: '#9c27b0' }} />,
            color: '#9c27b0',
            bgColor: '#f3e5f5'
        }
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Quản lý khách hàng
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
                    Trang quản lý khách hàng đang được phát triển...
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Tính năng này sẽ bao gồm:
                </Typography>
                <ul style={{ textAlign: 'left', marginTop: '16px' }}>
                    <li>Danh sách khách hàng</li>
                    <li>Thông tin liên hệ</li>
                    <li>Lịch sử giao dịch</li>
                    <li>Đánh giá khách hàng</li>
                </ul>
            </Paper>
        </Box>
    );
};

export default Customers;
