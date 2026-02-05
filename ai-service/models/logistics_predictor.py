# ai-service/models/logistics_predictor.py
# MIA Logistics Manager - Logistics Predictor Model
# Model cho dự đoán thời gian giao hàng, chi phí vận chuyển và nhu cầu logistics

import numpy as np
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta

class LogisticsPredictor:
    """
    Predictor class cho các dự đoán logistics:
    - Thời gian giao hàng
    - Chi phí vận chuyển
    - Dự báo nhu cầu
    - Tối ưu hóa tuyến đường
    """

    def __init__(self):
        """Initialize logistics predictor với các tham số mặc định"""
        # Vehicle speed factors (km/h average)
        self.vehicle_speeds = {
            "truck": 50,      # Xe tải: 50 km/h
            "van": 60,        # Xe bán tải: 60 km/h
            "motorcycle": 40  # Xe máy: 40 km/h
        }

        # Traffic condition multipliers
        self.traffic_multipliers = {
            "low": 1.0,       # Giao thông thấp
            "normal": 1.3,    # Bình thường
            "high": 1.8       # Cao điểm
        }

        # Weather multipliers
        self.weather_multipliers = {
            "clear": 1.0,
            "rain": 1.2,
            "fog": 1.4
        }

        # Base rates per km (VND)
        self.base_rates = {
            "standard": 5000,   # VND/km
            "express": 8000,     # VND/km
            "premium": 12000     # VND/km
        }

        # Volume rate (VND per m3)
        self.volume_rate = 50000

        # Weight rate (VND per kg)
        self.weight_rate = 1000

        # Remote area surcharge (percentage)
        self.remote_surcharge = 0.3  # 30%

        self.is_trained = False

    def predict_delivery_time(
        self,
        distance_km: float,
        vehicle_type: str,
        traffic_condition: str = "normal",
        weather: str = "clear"
    ) -> Dict[str, Any]:
        """
        Dự đoán thời gian giao hàng dựa trên khoảng cách và điều kiện

        Args:
            distance_km: Khoảng cách (km)
            vehicle_type: Loại xe ("truck", "van", "motorcycle")
            traffic_condition: Điều kiện giao thông
            weather: Điều kiện thời tiết

        Returns:
            Dict với predicted hours, minutes, confidence, factors
        """
        # Base speed cho loại xe
        base_speed = self.vehicle_speeds.get(vehicle_type, 50)

        # Apply multipliers
        traffic_mult = self.traffic_multipliers.get(traffic_condition, 1.3)
        weather_mult = self.weather_multipliers.get(weather, 1.0)

        # Adjusted speed
        adjusted_speed = base_speed / (traffic_mult * weather_mult)

        # Calculate time
        hours = distance_km / adjusted_speed
        minutes = int((hours - int(hours)) * 60)
        hours_int = int(hours)

        # Confidence based on distance và conditions
        if distance_km < 50:
            confidence = 0.85
        elif distance_km < 200:
            confidence = 0.75
        else:
            confidence = 0.65

        # Add buffer time for loading/unloading (30 minutes)
        minutes += 30
        if minutes >= 60:
            hours_int += 1
            minutes -= 60

        return {
            "hours": hours_int,
            "minutes": minutes,
            "confidence": round(confidence, 2),
            "factors": {
                "distance_km": distance_km,
                "vehicle_type": vehicle_type,
                "base_speed_kmh": base_speed,
                "adjusted_speed_kmh": round(adjusted_speed, 2),
                "traffic_condition": traffic_condition,
                "weather": weather
            }
        }

    def estimate_shipping_cost(
        self,
        distance_km: float,
        volume_m3: float,
        weight_kg: float,
        carrier_type: str = "standard",
        remote_area: bool = False
    ) -> Dict[str, Any]:
        """
        Ước tính chi phí vận chuyển

        Args:
            distance_km: Khoảng cách (km)
            volume_m3: Khối lượng (m³)
            weight_kg: Trọng lượng (kg)
            carrier_type: Loại dịch vụ
            remote_area: Có phải vùng xa không

        Returns:
            Dict với total_cost, breakdown, confidence
        """
        # Base distance cost
        base_rate = self.base_rates.get(carrier_type, 5000)
        distance_cost = distance_km * base_rate

        # Volume cost
        volume_cost = volume_m3 * self.volume_rate

        # Weight cost
        weight_cost = weight_kg * self.weight_rate

        # Subtotal
        subtotal = distance_cost + volume_cost + weight_cost

        # Remote area surcharge
        surcharge = 0
        if remote_area:
            surcharge = subtotal * self.remote_surcharge

        # Total
        total_cost = int(subtotal + surcharge)

        # Confidence
        confidence = 0.80 if distance_km < 300 else 0.70

        return {
            "total_cost": total_cost,
            "breakdown": {
                "distance_cost": int(distance_cost),
                "volume_cost": int(volume_cost),
                "weight_cost": int(weight_cost),
                "remote_surcharge": int(surcharge),
                "subtotal": int(subtotal)
            },
            "confidence": round(confidence, 2)
        }

    def forecast_demand(
        self,
        location: str,
        date: str,
        historical_data: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """
        Dự báo nhu cầu vận chuyển

        Args:
            location: Địa điểm
            date: Ngày cần dự báo (YYYY-MM-DD)
            historical_data: Dữ liệu lịch sử (optional)

        Returns:
            Dict với forecasted_demand, trend, confidence, factors
        """
        # Parse date
        target_date = datetime.strptime(date, "%Y-%M-%d")
        day_of_week = target_date.weekday()  # 0=Monday, 6=Sunday

        # Base forecast (simplified - trong thực tế cần ML model)
        base_demand = 50  # Đơn hàng/ngày cơ bản

        # Day of week adjustment
        day_multipliers = {
            0: 1.0,   # Monday
            1: 1.1,   # Tuesday
            2: 1.2,   # Wednesday
            3: 1.15,  # Thursday
            4: 1.3,   # Friday
            5: 0.8,   # Saturday
            6: 0.5    # Sunday
        }

        multiplier = day_multipliers.get(day_of_week, 1.0)
        forecasted = int(base_demand * multiplier)

        # Trend (simplified)
        if day_of_week < 5:  # Weekday
            trend = "increasing"
        else:
            trend = "decreasing"

        confidence = 0.70

        return {
            "demand": forecasted,
            "trend": trend,
            "confidence": round(confidence, 2),
            "factors": {
                "location": location,
                "day_of_week": day_of_week,
                "base_demand": base_demand,
                "multiplier": multiplier
            }
        }

    def optimize_route(self, waypoints: List[Dict]) -> Dict[str, Any]:
        """
        Tối ưu hóa tuyến đường (simplified - nearest neighbor)

        Args:
            waypoints: List of {lat, lng, name} dicts

        Returns:
            Dict với optimized route, total distance, estimated time
        """
        if len(waypoints) < 2:
            return {
                "route": waypoints,
                "total_distance": 0,
                "estimated_time": 0,
                "savings": 0
            }

        # Simplified optimization (nearest neighbor algorithm)
        optimized = [waypoints[0]]  # Start from first point
        remaining = waypoints[1:]

        current = waypoints[0]
        total_distance = 0

        while remaining:
            # Find nearest point
            nearest = min(
                remaining,
                key=lambda p: self._calculate_distance(
                    current.get("lat", 0),
                    current.get("lng", 0),
                    p.get("lat", 0),
                    p.get("lng", 0)
                )
            )

            # Calculate distance
            dist = self._calculate_distance(
                current.get("lat", 0),
                current.get("lng", 0),
                nearest.get("lat", 0),
                nearest.get("lng", 0)
            )
            total_distance += dist

            optimized.append(nearest)
            remaining.remove(nearest)
            current = nearest

        # Estimate time (assuming 50 km/h average)
        estimated_time = round(total_distance / 50, 2)

        # Calculate savings (simplified - compare với original order)
        original_distance = self._calculate_route_distance(waypoints)
        savings = max(0, ((original_distance - total_distance) / original_distance) * 100) if original_distance > 0 else 0

        return {
            "route": optimized,
            "total_distance": round(total_distance, 2),
            "estimated_time": estimated_time,
            "savings": round(savings, 2)
        }

    def _calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """
        Calculate distance between two points using Haversine formula (km)
        """
        from math import radians, cos, sin, asin, sqrt

        # Convert to radians
        lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])

        # Haversine formula
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
        c = 2 * asin(sqrt(a))

        # Radius of earth in km
        r = 6371

        return c * r

    def _calculate_route_distance(self, waypoints: List[Dict]) -> float:
        """Calculate total distance of route"""
        total = 0
        for i in range(len(waypoints) - 1):
            p1 = waypoints[i]
            p2 = waypoints[i + 1]
            total += self._calculate_distance(
                p1.get("lat", 0),
                p1.get("lng", 0),
                p2.get("lat", 0),
                p2.get("lng", 0)
            )
        return total

