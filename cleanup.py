#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
定时清理脚本 - 清理打包的源码文件
用于宝塔定时任务执行

使用方法:
  python cleanup.py           # 清理超过24小时的文件
  python cleanup.py --hours 6 # 清理超过6小时的文件
  python cleanup.py --all     # 清理所有文件
"""

import os
import shutil
import time
import argparse
from datetime import datetime

# 目录配置
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SITES_DIR = os.path.join(BASE_DIR, 'static', 'sites')      # ZIP文件目录
DOWNLOAD_DIR = os.path.join(BASE_DIR, 'downloads')         # 临时下载目录

def get_file_age_hours(file_path):
    """获取文件存在时间（小时）"""
    try:
        mtime = os.path.getmtime(file_path)
        age_seconds = time.time() - mtime
        return age_seconds / 3600
    except:
        return 0

def cleanup_directory(directory, max_hours=None, extensions=None):
    """
    清理目录
    :param directory: 目录路径
    :param max_hours: 保留时间（小时），None表示清理所有
    :param extensions: 要清理的文件扩展名列表，None表示所有文件
    :return: 删除的文件数量和大小
    """
    if not os.path.exists(directory):
        return 0, 0
    
    deleted_count = 0
    deleted_size = 0
    
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        
        try:
            # 检查扩展名
            if extensions and os.path.isfile(item_path):
                if not any(item.endswith(ext) for ext in extensions):
                    continue
            
            # 检查文件年龄
            if max_hours is not None:
                age = get_file_age_hours(item_path)
                if age < max_hours:
                    continue
            
            # 获取大小
            if os.path.isfile(item_path):
                size = os.path.getsize(item_path)
            else:
                size = sum(
                    os.path.getsize(os.path.join(root, f))
                    for root, dirs, files in os.walk(item_path)
                    for f in files
                )
            
            # 删除
            if os.path.isfile(item_path):
                os.remove(item_path)
            else:
                shutil.rmtree(item_path, ignore_errors=True)
            
            deleted_count += 1
            deleted_size += size
            print(f"  [删除] {item} ({size / 1024:.1f} KB)")
            
        except Exception as e:
            print(f"  [错误] 无法删除 {item}: {e}")
    
    return deleted_count, deleted_size

def main():
    parser = argparse.ArgumentParser(description='清理打包的源码文件')
    parser.add_argument('--hours', type=int, default=24, help='保留时间（小时），默认24小时')
    parser.add_argument('--all', action='store_true', help='清理所有文件，忽略时间限制')
    args = parser.parse_args()
    
    max_hours = None if args.all else args.hours
    
    print("=" * 50)
    print(f"WebClone 定时清理任务")
    print(f"执行时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if max_hours:
        print(f"清理规则: 超过 {max_hours} 小时的文件")
    else:
        print(f"清理规则: 所有文件")
    print("=" * 50)
    
    total_count = 0
    total_size = 0
    
    # 清理ZIP文件
    print(f"\n[1] 清理ZIP文件目录: {SITES_DIR}")
    count, size = cleanup_directory(SITES_DIR, max_hours, extensions=['.zip'])
    total_count += count
    total_size += size
    print(f"    删除 {count} 个文件，释放 {size / 1024 / 1024:.2f} MB")
    
    # 清理临时下载目录
    print(f"\n[2] 清理临时下载目录: {DOWNLOAD_DIR}")
    count, size = cleanup_directory(DOWNLOAD_DIR, max_hours)
    total_count += count
    total_size += size
    print(f"    删除 {count} 个文件/目录，释放 {size / 1024 / 1024:.2f} MB")
    
    print("\n" + "=" * 50)
    print(f"清理完成!")
    print(f"总计删除: {total_count} 个文件/目录")
    print(f"释放空间: {total_size / 1024 / 1024:.2f} MB")
    print("=" * 50)

if __name__ == '__main__':
    main()

