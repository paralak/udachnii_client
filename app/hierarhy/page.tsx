'use client'

import { useState, Children } from 'react';

interface HierarchyItem {
  name: string;
  parent: string;
  type: 'obj' | 'person' | 'department' | 'store';
}

interface HierarchyData {
  [key: string]: HierarchyItem;
}

const hierarchyDbResponse: HierarchyData = {
  "0": {
    name: "Удачный",
    parent: "-1",
    type: "obj",
  },
  "1": {
    name: "Николай Серебреников",
    parent: "0",
    type: "person",
  },
  "2": {
    name: "Отдел Кулинария",
    parent: "1",
    type: "department",
  },
  "3": {
    name: "Отдел IT",
    parent: "1",
    type: "department",
  },
  "4": {
    name: "Матвей Точин",
    parent: "3",
    type: "person",
  },
  "5": {
    name: "Ярослав Надточий",
    parent: "4",
    type: "person",
  },
  "6": {
    name: "Алексей",
    parent: "2",
    type: "person",
  },
  "7": {
    name: "Юлия Бойко",
    parent: "6",
    type: "person",
  },
  "8": {
    name: "Юлия Олеговна",
    parent: "6",
    type: "person",
  },
  "9": {
    name: "Бугры, кулинария",
    parent: "7",
    type: "store",
  },
};

// Базовый компонент для всех элементов с возможностью раскрытия
function CollapsibleItem({ 
  name, 
  type, 
  children, 
  isRoot = false,
  defaultExpanded = false 
}: { 
  name: string; 
  type: 'obj' | 'person' | 'department' | 'store';
  children?: React.ReactNode; 
  isRoot?: boolean;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = Children.count(children) > 0;

  const typeConfig = {
    obj: { color: 'blue', label: 'object' },
    person: { color: 'green', label: 'person' },
    department: { color: 'purple', label: 'department' },
    store: { color: 'orange', label: 'store' }
  };

  const config = typeConfig[type];

  return (
    <div className={`${isRoot ? '' : 'ml-3'} my-1`}>
      <div 
        className={`p-2 rounded-lg border-l-2 bg-${config.color}-50 border-${config.color}-500 cursor-pointer hover:bg-${config.color}-100 transition-colors ${
          hasChildren ? 'pr-8' : ''
        }`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          {hasChildren && (
            <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
          <span className={`w-2 h-2 rounded-full bg-${config.color}-500`}></span>
          <span className="font-medium text-sm">{name}</span>
          <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">
            {config.label}
          </span>
          {hasChildren && (
            <span className="text-xs text-gray-400 ml-auto">
              {isExpanded ? '▲' : '▼'}
            </span>
          )}
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="border-l border-gray-200 ml-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Обновленные компоненты для каждого типа
function ObjectItem({ 
  name, 
  children, 
  isRoot = false,
  defaultExpanded = false 
}: { 
  name: string; 
  children?: React.ReactNode; 
  isRoot?: boolean;
  defaultExpanded?: boolean;
}) {
  return (
    <CollapsibleItem 
      name={name} 
      type="obj" 
      isRoot={isRoot}
      defaultExpanded={defaultExpanded}
    >
      {children}
    </CollapsibleItem>
  );
}

function PersonItem({ 
  name, 
  children, 
  isRoot = false,
  defaultExpanded = false 
}: { 
  name: string; 
  children?: React.ReactNode; 
  isRoot?: boolean;
  defaultExpanded?: boolean;
}) {
  return (
    <CollapsibleItem 
      name={name} 
      type="person" 
      isRoot={isRoot}
      defaultExpanded={defaultExpanded}
    >
      {children}
    </CollapsibleItem>
  );
}

function DepartmentItem({ 
  name, 
  children, 
  isRoot = false,
  defaultExpanded = false 
}: { 
  name: string; 
  children?: React.ReactNode; 
  isRoot?: boolean;
  defaultExpanded?: boolean;
}) {
  return (
    <CollapsibleItem 
      name={name} 
      type="department" 
      isRoot={isRoot}
      defaultExpanded={defaultExpanded}
    >
      {children}
    </CollapsibleItem>
  );
}

function StoreItem({ 
  name, 
  children, 
  isRoot = false,
  defaultExpanded = false 
}: { 
  name: string; 
  children?: React.ReactNode; 
  isRoot?: boolean;
  defaultExpanded?: boolean;
}) {
  return (
    <CollapsibleItem 
      name={name} 
      type="store" 
      isRoot={isRoot}
      defaultExpanded={defaultExpanded}
    >
      {children}
    </CollapsibleItem>
  );
}

// Основной компонент для отрисовки иерархии
function HierarchyRenderer({ data }: { data: HierarchyData }) {
  const renderHierarchy = (parentId: string, level: number = 0) => {
    const children = Object.entries(data).filter(([_, item]) => item.parent === parentId);
    
    return children.length > 0 ? (
      <div>
        {children.map(([id, item]) => {
          const childElements = renderHierarchy(id, level + 1);
          
          // Первый уровень всегда раскрыт, остальные - свернуты
          const defaultExpanded = level === 0;

          switch (item.type) {
            case 'obj':
              return (
                <ObjectItem 
                  key={id} 
                  name={item.name}
                  defaultExpanded={defaultExpanded}
                >
                  {childElements}
                </ObjectItem>
              );
            case 'person':
              return (
                <PersonItem 
                  key={id} 
                  name={item.name}
                  defaultExpanded={defaultExpanded}
                >
                  {childElements}
                </PersonItem>
              );
            case 'department':
              return (
                <DepartmentItem 
                  key={id} 
                  name={item.name}
                  defaultExpanded={defaultExpanded}
                >
                  {childElements}
                </DepartmentItem>
              );
            case 'store':
              return (
                <StoreItem 
                  key={id} 
                  name={item.name}
                  defaultExpanded={defaultExpanded}
                >
                  {childElements}
                </StoreItem>
              );
            default:
              return null;
          }
        })}
      </div>
    ) : null;
  };

  const rootItems = Object.entries(data).filter(([id, item]) => {
    return item.parent === "-1" || 
           !data[item.parent] || 
           item.parent === id;
  });

  return (
    <div>
      {rootItems.map(([id, item]) => (
        <div key={id}>
          {item.type === 'obj' && (
            <ObjectItem 
              name={item.name} 
              isRoot={true}
              defaultExpanded={true}
            >
              {renderHierarchy(id)}
            </ObjectItem>
          )}
          {item.type === 'person' && (
            <PersonItem 
              name={item.name} 
              isRoot={true}
              defaultExpanded={true}
            >
              {renderHierarchy(id)}
            </PersonItem>
          )}
          {item.type === 'department' && (
            <DepartmentItem 
              name={item.name} 
              isRoot={true}
              defaultExpanded={true}
            >
              {renderHierarchy(id)}
            </DepartmentItem>
          )}
          {item.type === 'store' && (
            <StoreItem 
              name={item.name} 
              isRoot={true}
              defaultExpanded={true}
            >
              {renderHierarchy(id)}
            </StoreItem>
          )}
        </div>
      ))}
    </div>
  );
}

// Использование в компоненте Home
export default function Home() {
  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Organizational Hierarchy</h1>
        <div className="bg-white rounded-lg shadow-sm border p-3">
          <HierarchyRenderer data={hierarchyDbResponse} />
        </div>
      </div>
    </div>
  );
}