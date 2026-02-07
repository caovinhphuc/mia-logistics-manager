
            {/* Staff Efficiency Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-amber-500" />
                  Phân tích hiệu quả phân ca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Efficiency by shift */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Hiệu suất theo ca làm việc</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Ca 1 (8:00-14:00)</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                        <div className="mt-2 text-xs text-gray-500">
                          Hiệu suất cao nhất: 10:00-12:00 (95%)
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Ca 2 (12:00-18:00)</span>
                          <span className="font-medium">88%</span>
                        </div>
                        <Progress value={88} className="h-2" />
                        <div className="mt-2 text-xs text-gray-500">
                          Hiệu suất cao nhất: 14:00-16:00 (93%)
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Ca 3 (16:00-22:00)</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <div className="mt-2 text-xs text-gray-500">
                          Hiệu suất cao nhất: 16:00-18:00 (90%)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task completion rate */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Tỷ lệ hoàn thành công việc</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-1">
                          <Package className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium">Đơn hàng (SO)</span>
                        </div>
                        <div className="text-2xl font-bold">{Math.round((workloadData.salesOrders.today.completed / workloadData.salesOrders.today.total) * 100)}%</div>
                        <div className="text-xs text-gray-500">
                          {workloadData.salesOrders.today.completed}/{workloadData.salesOrders.today.total} đơn
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center mb-1">
                          <Truck className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-sm font-medium">Chuyển kho (CK)</span>
                        </div>
                        <div className="text-2xl font-bold">{Math.round((workloadData.transferOrders.today.completed / workloadData.transferOrders.today.total) * 100)}%</div>
                        <div className="text-xs text-gray-500">
                          {workloadData.transferOrders.today.completed}/{workloadData.transferOrders.today.total} phiếu
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center mb-1">
                          <FileDown className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium">Nhập hàng (PO)</span>
                        </div>
                        <div className="text-2xl font-bold">{Math.round((workloadData.purchaseOrders.today.completed / workloadData.purchaseOrders.today.total) * 100)}%</div>
                        <div className="text-xs text-gray-500">
                          {workloadData.purchaseOrders.today.completed}/{workloadData.purchaseOrders.today.total} phiếu
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Staff utilization */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium mb-3">Hiệu suất sử dụng nhân viên</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tỷ lệ sử dụng nhân viên hợp lý</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tỷ lệ nhân viên quá tải</span>
                        <span className="font-medium text-red-600">12%</span>
                      </div>
                      <Progress value={12} className="h-2 bg-red-100" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tỷ lệ nhân viên không đủ việc</span>
                        <span className="font-medium">8%</span>
                      </div>
                      <Progress value={8} className="h-2 bg-amber-100" />
                    </div>
                  </div>

                  {/* Optimization suggestions */}
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTitle className="text-blue-800 font-medium flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                      Đề xuất tối ưu hóa phân ca
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 text-sm mt-1">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <ArrowRight className="mr-1 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Điều chuyển 2 nhân viên từ 10:00-12:00 sang 12:00-14:00 để cân bằng khối lượng xử lý SO</span>
                        </div>
                        <div className="flex items-start">
                          <ArrowRight className="mr-1 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Bổ sung 2 CTV vào Ca 3 (16:00-22:00) để tăng hiệu suất xử lý đơn cuối ngày</span>
                        </div>
                        <div className="flex items-start">
                          <ArrowRight className="mr-1 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Điều chỉnh thời gian bắt đầu Ca 2 từ 12:00 thành 11:30 để tối ưu hóa khả năng xử lý đơn trong giờ cao điểm</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm">
                          <Save className="mr-1 h-4 w-4" />
                          Áp dụng đề xuất
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-1 h-4 w-4" />
                          Tùy chỉnh
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
      {/* Staff Allocation Modal */}
      {showStaffAllocationModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Phân công nhân viên</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowStaffAllocationModal(false)}
              >
                <span className="sr-only">Đóng</span>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Shift selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Chọn ca làm việc</label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ca 1 (8:00 - 14:00)</SelectItem>
                    <SelectItem value="2">Ca 2 (12:00 - 18:00)</SelectItem>
                    <SelectItem value="3">Ca 3 (16:00 - 22:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Task type */}
              <div>
                <label className="block text-sm font-medium mb-1">Loại công việc</label>
                <Select defaultValue="so">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại công việc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="so">Xử lý SO</SelectItem>
                    <SelectItem value="ck">Xử lý CK</SelectItem>
                    <SelectItem value="po">Xử lý PO</SelectItem>
                    <SelectItem value="supervision">Giám sát</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Available staff */}
              <div>
                <label className="block text-sm font-medium mb-2">Nhân viên khả dụng</label>
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cấp bậc</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kỹ năng</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {staffList.filter(s => s.status === 'available').map(staff => (
                        <tr key={staff.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-xs text-gray-500">{staff.role}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                staff.level === 'Expert' ? 'bg-blue-100 text-blue-800' :
                                staff.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                                staff.level === 'Regular' ? 'bg-green-100 text-green-800' :
                                'bg-amber-100 text-amber-800'
                              }
                            >
                              {staff.level}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              {staff.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  className={
                                    skill === 'SO' ? 'bg-blue-100 text-blue-800' :
                                    skill === 'CK' ? 'bg-purple-100 text-purple-800' :
                                    'bg-green-100 text-green-800'
                                  }
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button size="sm">Phân công</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800 font-medium">Gợi ý phân công tự động</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm mt-1">
                  <p>Dựa trên kỹ năng và mức độ sẵn có, hệ thống gợi ý phân công Trương Thị K để xử lý SO trong Ca 2.</p>
                  <Button size="sm" className="mt-2">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    Áp dụng gợi ý
                  </Button>
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowStaffAllocationModal(false)}>Hủy</Button>
                <Button>Xác nhận phân công</Button>
              </div>
      </div>
      <td className="border px-4 py-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                          </div>
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <div className="flex items-center justify-center">
                            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                          </div>
                        </td>
                        <td className="border px-4 py-2 text-center font-medium">70%</td>


                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Thành thạo</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-amber-500 rounded-full mr-2"></div>
                      <span className="text-sm">Cơ bản</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm">Cần đào tạo</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Xem kế hoạch đào tạo
                  </Button>
                </div>


            {/* Staff Efficiency Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-amber-500" />
                  Phân tích hiệu quả phân ca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Efficiency by shift */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Hiệu suất theo ca làm việc</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Ca 1 (8:00-14:00)</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                        <div className="mt-2 text-xs text-gray-500">
                          Hiệu suất cao nhất: 10:00-12:00 (95%)
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Ca 2 (12:00-18:00)</span>
                          <span className="font-medium">88%</span>
                        </div>
                        <Progress value={88} className="h-2" />
                        <div className="mt-2 text-xs text-gray-500">
                          Hiệu suất cao nhất: 14:00-16:00 (93%)
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Ca 3 (16:00-22:00)</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <div className="mt-2 text-xs text-gray-500">
                          Hiệu suất cao nhất: 16:00-18:00 (90%)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task completion rate */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Tỷ lệ hoàn thành công việc</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-1">
                          <Package className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium">Đơn hàng (SO)</span>
                        </div>
                        <div className="text-2xl font-bold">{Math.round((workloadData.salesOrders.today.completed / workloadData.salesOrders.today.total) * 100)}%</div>
                        <div className="text-xs text-gray-500">
                          {workloadData.salesOrders.today.completed}/{workloadData.salesOrders.today.total} đơn
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center mb-1">
                          <Truck className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-sm font-medium">Chuyển kho (CK)</span>
                        </div>
                        <div className="text-2xl font-bold">{Math.round((workloadData.transferOrders.today.completed / workloadData.transferOrders.today.total) * 100)}%</div>
                        <div className="text-xs text-gray-500">
                          {workloadData.transferOrders.today.completed}/{workloadData.transferOrders.today.total} phiếu
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center mb-1">
                          <FileDown className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium">Nhập hàng (PO)</span>
                        </div>
                        <div className="text-2xl font-bold">{Math.round((workloadData.purchaseOrders.today.completed / workloadData.purchaseOrders.today.total) * 100)}%</div>
                        <div className="text-xs text-gray-500">
                          {workloadData.purchaseOrders.today.completed}/{workloadData.purchaseOrders.today.total} phiếu
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Staff utilization */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium mb-3">Hiệu suất sử dụng nhân viên</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tỷ lệ sử dụng nhân viên hợp lý</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tỷ lệ nhân viên quá tải</span>
                        <span className="font-medium text-red-600">12%</span>
                      </div>
                      <Progress value={12} className="h-2 bg-red-100" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tỷ lệ nhân viên không đủ việc</span>
                        <span className="font-medium">8%</span>
                      </div>
                      <Progress value={8} className="h-2 bg-amber-100" />
                    </div>
                  </div>

                  {/* Optimization suggestions */}
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTitle className="text-blue-800 font-medium flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                      Đề xuất tối ưu hóa phân ca
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 text-sm mt-1">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <ArrowRight className="mr-1 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Điều chuyển 2 nhân viên từ 10:00-12:00 sang 12:00-14:00 để cân bằng khối lượng xử lý SO</span>
                        </div>
                        <div className="flex items-start">
                          <ArrowRight className="mr-1 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Bổ sung 2 CTV vào Ca 3 (16:00-22:00) để tăng hiệu suất xử lý đơn cuối ngày</span>
                        </div>
                        <div className="flex items-start">
                          <ArrowRight className="mr-1 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Điều chỉnh thời gian bắt đầu Ca 2 từ 12:00 thành 11:30 để tối ưu hóa khả năng xử lý đơn trong giờ cao điểm</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm">
                          <Save className="mr-1 h-4 w-4" />
                          Áp dụng đề xuất
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-1 h-4 w-4" />
                          Tùy chỉnh
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

      {/* Staff Allocation Modal */}
      {showStaffAllocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Phân công nhân viên</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowStaffAllocationModal(false)}
              >
                <span className="sr-only">Đóng</span>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Shift selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Chọn ca làm việc</label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ca 1 (8:00 - 14:00)</SelectItem>
                    <SelectItem value="2">Ca 2 (12:00 - 18:00)</SelectItem>
                    <SelectItem value="3">Ca 3 (16:00 - 22:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Task type */}
              <div>
                <label className="block text-sm font-medium mb-1">Loại công việc</label>
                <Select defaultValue="so">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại công việc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="so">Xử lý SO</SelectItem>
                    <SelectItem value="ck">Xử lý CK</SelectItem>
                    <SelectItem value="po">Xử lý PO</SelectItem>
                    <SelectItem value="supervision">Giám sát</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Available staff */}
              <div>
                <label className="block text-sm font-medium mb-2">Nhân viên khả dụng</label>
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cấp bậc</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kỹ năng</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {staffList.filter(s => s.status === 'available').map(staff => (
                        <tr key={staff.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-xs text-gray-500">{staff.role}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                staff.level === 'Expert' ? 'bg-blue-100 text-blue-800' :
                                staff.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                                staff.level === 'Regular' ? 'bg-green-100 text-green-800' :
                                'bg-amber-100 text-amber-800'
                              }
                            >
                              {staff.level}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              {staff.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  className={
                                    skill === 'SO' ? 'bg-blue-100 text-blue-800' :
                                    skill === 'CK' ? 'bg-purple-100 text-purple-800' :
                                    'bg-green-100 text-green-800'
                                  }
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button size="sm">Phân công</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800 font-medium">Gợi ý phân công tự động</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm mt-1">
                  <p>Dựa trên kỹ năng và mức độ sẵn có, hệ thống gợi ý phân công Trương Thị K để xử lý SO trong Ca 2.</p>
                  <Button size="sm" className="mt-2">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    Áp dụng gợi ý
                  </Button>
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowStaffAllocationModal(false)}>Hủy</Button>
                <Button>Xác nhận phân công</Button>
              </div>
            </div>
          </div>
        </div>
      )}


