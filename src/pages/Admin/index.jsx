import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAllUsers, 
  deleteUser, 
  updateUser,
  getAllTestResults,
  getStats 
} from '../../services/admin';
import { 
  TrashIcon, 
  PencilIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CheckCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Admin = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCareer, setFilterCareer] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUserTests, setSelectedUserTests] = useState([]);
  const [showUserTestsModal, setShowUserTestsModal] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('No tienes permisos para acceder a esta página');
      setLoading(false);
      return;
    }
    
    loadData();
  }, [user, token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, resultsData, statsData] = await Promise.all([
        getAllUsers(token),
        getAllTestResults(token),
        getStats(token)
      ]);
      
      setUsers(usersData.users);
      setTestResults(resultsData.results);
      setStats(statsData.stats);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await deleteUser(token, userId);
      setUsers(users.filter(u => u.id !== userId));
      await loadData();
    } catch (err) {
      alert('Error al eliminar usuario: ' + err.message);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Usuario', 'Email', 'Fecha', 'Carrera', 'Confianza', 'Top_Carreras'];
    
    const rows = testResults.map(result => [
      result.id,
      result.user?.name || 'N/A',
      result.user?.email || 'N/A',
      new Date(result.completedAt).toLocaleString('es-ES'),
      result.predictedCareer || 'N/A',
      result.confidence ? result.confidence + '%' : 'N/A',
      result.topCareers ? result.topCareers.map(c => c.carrera + ':' + c.porcentaje + '%').join(';') : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => '"' + cell + '"').join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resultados_tests_' + new Date().toISOString().split('T')[0] + '.csv';
    link.click();
  };

  const exportUserReport = (result) => {
    const lines = [
      'INFORME DE ORIENTACIÓN VOCACIONAL',
      '=====================================',
      '',
      'INFORMACIÓN DEL ESTUDIANTE',
      '--------------------------',
      'Nombre: ' + (result.user?.name || 'N/A'),
      'Email: ' + (result.user?.email || 'N/A'),
      'Fecha del Test: ' + new Date(result.completedAt).toLocaleString('es-ES'),
      'ID del Test: ' + result.id,
      '',
      'RESULTADO PRINCIPAL',
      '-------------------',
      'Carrera Recomendada: ' + (result.predictedCareer || 'N/A'),
      'Nivel de Confianza: ' + (result.confidence ? result.confidence + '%' : 'N/A'),
      '',
      'TOP 5 CARRERAS COMPATIBLES',
      '---------------------------'
    ];

    if (result.topCareers) {
      result.topCareers.forEach((c, i) => {
        lines.push((i + 1) + '. ' + c.carrera + ' - ' + c.porcentaje + '%');
      });
    }

    lines.push('');
    lines.push('PERFIL VOCACIONAL (RIASEC)');
    lines.push('---------------------------');
    if (result.profile) {
      lines.push('R (Realista): ' + result.profile.R + '/5');
      lines.push('I (Investigador): ' + result.profile.I + '/5');
      lines.push('A (Artístico): ' + result.profile.A + '/5');
      lines.push('S (Social): ' + result.profile.S + '/5');
      lines.push('E (Emprendedor): ' + result.profile.E + '/5');
      lines.push('C (Convencional): ' + result.profile.C + '/5');
    }

    lines.push('');
    lines.push('INTELIGENCIAS MÚLTIPLES (GARDNER)');
    lines.push('----------------------------------');
    if (result.profile) {
      lines.push('LM (Lógico-Matemática): ' + result.profile.LM + '/5');
      lines.push('L (Lingüística): ' + result.profile.L + '/5');
      lines.push('ES (Espacial): ' + result.profile.ES + '/5');
      lines.push('M (Musical): ' + result.profile.M + '/5');
      lines.push('CK (Corporal-Kinestésica): ' + result.profile.CK + '/5');
      lines.push('IP (Interpersonal): ' + result.profile.IP + '/5');
      lines.push('IA (Intrapersonal): ' + result.profile.IA + '/5');
      lines.push('N (Naturalista): ' + result.profile.N + '/5');
    }

    lines.push('');
    lines.push('RENDIMIENTO ACADÉMICO');
    lines.push('---------------------');
    if (result.profile) {
      lines.push('General: ' + result.profile.Rendimiento_General + '/5');
      lines.push('STEM: ' + result.profile.Rendimiento_STEM + '/5');
      lines.push('Humanidades: ' + result.profile.Rendimiento_Humanidades + '/5');
    }

    lines.push('');
    lines.push('=====================================');
    lines.push('Generado el: ' + new Date().toLocaleString('es-ES'));
    lines.push('Sistema de Orientación Vocacional - Prototipo OVP');

    const report = lines.join('\n');
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileName = 'informe_' + (result.user?.name?.replace(/\s+/g, '_') || 'usuario') + '_' + result.id + '.txt';
    link.download = fileName;
    link.click();
  };

  const filteredResults = testResults.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCareer = filterCareer === '' || 
      result.predictedCareer?.toLowerCase().includes(filterCareer.toLowerCase());
    
    return matchesSearch && matchesCareer;
  });

  const filteredUsers = users.filter(u => 
    searchTerm === '' ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueCareers = [...new Set(testResults.map(r => r.predictedCareer).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (error || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XMarkIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">{error || 'No tienes permisos de administrador'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-600">Gestiona usuarios y visualiza resultados</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <UsersIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administradores</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAdmins}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ChartBarIcon className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tests Completados</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTests}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DocumentTextIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa Completación</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalUsers > 0 ? Math.round((stats.totalTests / stats.totalUsers) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <CheckCircleIcon className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={'px-6 py-4 text-sm font-medium border-b-2 transition-colors ' + (
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>Resumen</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={'px-6 py-4 text-sm font-medium border-b-2 transition-colors ' + (
                  activeTab === 'users'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-5 h-5" />
                  <span>Usuarios ({users.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={'px-6 py-4 text-sm font-medium border-b-2 transition-colors ' + (
                  activeTab === 'results'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Resultados ({testResults.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Análisis General</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Carreras Más Recomendadas</h3>
                <div className="space-y-3">
                  {Object.entries(
                    testResults.reduce((acc, result) => {
                      if (result.predictedCareer) {
                        acc[result.predictedCareer] = (acc[result.predictedCareer] || 0) + 1;
                      }
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([career, count]) => {
                      const percentage = (count / testResults.length) * 100;
                      return (
                        <div key={career} className="flex items-center">
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{career}</span>
                              <span className="text-sm text-gray-500">{count} estudiantes ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: percentage + '%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tests Recientes</h3>
                <div className="space-y-3">
                  {testResults.slice(0, 5).map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{result.user?.name || 'Usuario eliminado'}</p>
                          <p className="text-sm text-gray-500">{result.predictedCareer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{result.confidence}%</p>
                        <p className="text-xs text-gray-500">
                          {new Date(result.completedAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Gestión de Usuarios</h2>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Registro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((u) => {
                      const userTests = testResults.filter(r => r.userId === u.id);
                      return (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">
                                  {u.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{u.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{u.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ' + (
                              u.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            )}>
                              {u.role === 'admin' ? 'Administrador' : 'Estudiante'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                              {userTests.length}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => {
                                const userResults = testResults.filter(r => r.userId === u.id);
                                if (userResults.length > 0) {
                                  setSelectedUserTests(userResults);
                                  setShowUserTestsModal(true);
                                } else {
                                  alert('Este usuario no ha completado ningún test');
                                }
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Ver Tests ({userTests.length})
                            </button>
                            {u.id !== user.id && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="w-5 h-5 inline" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Resultados de Tests</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por usuario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={filterCareer}
                      onChange={(e) => setFilterCareer(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Todas las carreras</option>
                      {uniqueCareers.map(career => (
                        <option key={career} value={career}>{career}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Carrera Principal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confianza
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {result.user?.name || 'Usuario eliminado'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {result.user?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(result.completedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {result.predictedCareer || 'No disponible'}
                          </div>
                          {result.topCareers && result.topCareers.length > 1 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{result.topCareers.length - 1} alternativas
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {result.confidence ? (
                            <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + (
                              result.confidence >= 80 ? 'bg-green-100 text-green-800' :
                              result.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            )}>
                              {result.confidence}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            onClick={() => {
                              setSelectedResult(result);
                              setShowDetailModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Ver Detalles
                          </button>
                          <button
                            onClick={() => exportUserReport(result)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay resultados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterCareer ? 'Intenta con otros filtros' : 'No se han completado tests aún'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDetailModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Test</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Información del Estudiante</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium">{selectedResult.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedResult.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha del Test</p>
                    <p className="font-medium">
                      {new Date(selectedResult.completedAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID del Test</p>
                    <p className="font-medium">{selectedResult.id}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Resultado Principal</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-indigo-900">
                      {selectedResult.predictedCareer}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Carrera Recomendada</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600">
                      {selectedResult.confidence}%
                    </p>
                    <p className="text-sm text-gray-600">Confianza</p>
                  </div>
                </div>
              </div>

              {selectedResult.topCareers && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Top 5 Carreras Compatibles</h4>
                  <div className="space-y-2">
                    {selectedResult.topCareers.map((career, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm mr-3">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{career.carrera}</span>
                            <span className="text-sm text-gray-500">{career.porcentaje}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: career.porcentaje + '%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedResult.profile && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Perfil Vocacional (RIASEC)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {['R', 'I', 'A', 'S', 'E', 'C'].map(dim => (
                      <div key={dim} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{dim}</span>
                          <span className="text-sm font-bold text-indigo-600">
                            {selectedResult.profile[dim]?.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: ((selectedResult.profile[dim] / 5) * 100) + '%' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedResult.profile && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Inteligencias Múltiples (Gardner)</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {['LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N'].map(dim => (
                      <div key={dim} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{dim}</span>
                          <span className="text-sm font-bold text-green-600">
                            {selectedResult.profile[dim]?.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: ((selectedResult.profile[dim] / 5) * 100) + '%' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedResult.profile && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Rendimiento Académico</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {selectedResult.profile.Rendimiento_General}/5
                      </p>
                      <p className="text-sm text-gray-600 mt-1">General</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {selectedResult.profile.Rendimiento_STEM}/5
                      </p>
                      <p className="text-sm text-gray-600 mt-1">STEM</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {selectedResult.profile.Rendimiento_Humanidades}/5
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Humanidades</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => exportUserReport(selectedResult)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Descargar Informe</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de lista de tests del usuario */}
      {showUserTestsModal && selectedUserTests.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tests de {selectedUserTests[0]?.user?.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Total: {selectedUserTests.length} test(s) completado(s)</p>
              </div>
              <button
                onClick={() => setShowUserTestsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {selectedUserTests.map((result, index) => (
                  <div key={result.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-lg">#{selectedUserTests.length - index}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{result.predictedCareer}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              result.confidence >= 80 ? 'bg-green-100 text-green-800' :
                              result.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {result.confidence}% confianza
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Realizado el {new Date(result.completedAt).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedResult(result);
                          setShowUserTestsModal(false);
                          setShowDetailModal(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        Ver Detalles
                      </button>
                    </div>

                    {result.topCareers && result.topCareers.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-3">Top 3 Carreras:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {result.topCareers.slice(0, 3).map((career, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600">#{idx + 1}</span>
                                <span className="text-sm font-bold text-indigo-600">{career.porcentaje}%</span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate">{career.carrera}</p>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div
                                  className="bg-indigo-600 h-1.5 rounded-full transition-all"
                                  style={{ width: `${career.porcentaje}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowUserTestsModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
